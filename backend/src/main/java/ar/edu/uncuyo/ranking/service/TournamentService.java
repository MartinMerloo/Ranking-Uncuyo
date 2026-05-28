package ar.edu.uncuyo.ranking.service;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ar.edu.uncuyo.ranking.dto.TournamentRequest;
import ar.edu.uncuyo.ranking.dto.TournamentResponse;
import ar.edu.uncuyo.ranking.dto.TournamentStandingEntry;
import ar.edu.uncuyo.ranking.exception.ResourceNotFoundException;
import ar.edu.uncuyo.ranking.model.Match;
import ar.edu.uncuyo.ranking.model.Player;
import ar.edu.uncuyo.ranking.model.Tournament;
import ar.edu.uncuyo.ranking.model.TournamentParticipant;
import ar.edu.uncuyo.ranking.repository.MatchRepository;
import ar.edu.uncuyo.ranking.repository.TournamentParticipantRepository;
import ar.edu.uncuyo.ranking.repository.TournamentRepository;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final MatchRepository matchRepository;
    private final TournamentParticipantRepository participantRepository;

    public TournamentService(
            TournamentRepository tournamentRepository,
            MatchRepository matchRepository,
            TournamentParticipantRepository participantRepository) {
        this.tournamentRepository = tournamentRepository;
        this.matchRepository = matchRepository;
        this.participantRepository = participantRepository;
    }

    @Transactional(readOnly = true)
    public List<TournamentResponse> findAll() {
        return tournamentRepository.findAllByOrderByDateDesc().stream()
                .map(TournamentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public TournamentResponse findById(Long id) {
        return TournamentResponse.from(getTournamentOrThrow(id));
    }

    @Transactional
    public TournamentResponse create(TournamentRequest request) {
        Tournament tournament = new Tournament();
        tournament.setName(request.getName().trim());
        tournament.setDate(request.getDate());
        tournament.setType(request.getType());
        tournament.setRounds(request.getRounds());
        return TournamentResponse.from(tournamentRepository.save(tournament));
    }

    public record ParticipantData(int byeCount, double des2, double des3) {}

    /**
     * Persists the full tournament roster from an Excel import, including players who only
     * received byes and therefore have no {@link Match} rows.
     */
    @Transactional
    public void registerImportedParticipants(Long tournamentId, Map<Player, ParticipantData> playerData) {
        Tournament tournament = getTournamentOrThrow(tournamentId);
        for (Map.Entry<Player, ParticipantData> entry : playerData.entrySet()) {
            TournamentParticipant participant = new TournamentParticipant();
            participant.setTournament(tournament);
            participant.setPlayer(entry.getKey());
            participant.setByeCount(Math.max(0, entry.getValue().byeCount()));
            participant.setDes2(entry.getValue().des2());
            participant.setDes3(entry.getValue().des3());
            participantRepository.save(participant);
        }
    }

    @Transactional(readOnly = true)
    public List<TournamentStandingEntry> getStandings(Long tournamentId) {
        Tournament tournament = getTournamentOrThrow(tournamentId);
        int totalRounds = tournament.getRounds();
        List<Match> matches = matchRepository.findByTournamentIdOrderByRoundAscIdAsc(tournamentId);

        Map<Long, int[]> stats = new LinkedHashMap<>();
        Map<Long, String> names = new LinkedHashMap<>();

        for (Match match : matches) {
            Long wId = match.getWhitePlayer().getId();
            Long bId = match.getBlackPlayer().getId();
            stats.computeIfAbsent(wId, k -> new int[4]);
            stats.computeIfAbsent(bId, k -> new int[4]);
            names.putIfAbsent(wId, match.getWhitePlayer().getFullName());
            names.putIfAbsent(bId, match.getBlackPlayer().getFullName());

            int[] ws = stats.get(wId);
            int[] bs = stats.get(bId);

            switch (match.getResult()) {
                case WHITE_WIN -> { ws[0]++; ws[3]++; bs[2]++; bs[3]++; }
                case BLACK_WIN -> { bs[0]++; bs[3]++; ws[2]++; ws[3]++; }
                case DRAW      -> { ws[1]++; ws[3]++; bs[1]++; bs[3]++; }
            }
        }

        List<TournamentParticipant> participants = participantRepository.findByTournamentId(tournamentId);
        for (TournamentParticipant participant : participants) {
            Player player = participant.getPlayer();
            names.putIfAbsent(player.getId(), player.getFullName());
        }

        Map<Long, double[]> tiebreaks = new LinkedHashMap<>();
        for (TournamentParticipant participant : participants) {
            double d2 = participant.getDes2() != null ? participant.getDes2() : 0.0;
            double d3 = participant.getDes3() != null ? participant.getDes3() : 0.0;
            tiebreaks.put(participant.getPlayer().getId(), new double[]{d2, d3});
        }

        Map<Long, Integer> byeCountsByPlayer = resolveByeCounts(tournamentId, totalRounds, stats, participants);
        Set<Long> playerIds = resolvePlayerUniverse(tournamentId, stats, byeCountsByPlayer);

        return playerIds.stream()
                .map(pid -> buildStandingEntry(pid, names, stats, byeCountsByPlayer, tiebreaks))
                .sorted((a, b) -> {
                    int cmp = Double.compare(b.getPoints(), a.getPoints());
                    if (cmp != 0) return cmp;
                    cmp = Double.compare(b.getDes2(), a.getDes2());
                    if (cmp != 0) return cmp;
                    cmp = Double.compare(b.getDes3(), a.getDes3());
                    if (cmp != 0) return cmp;
                    cmp = Integer.compare(b.getWins(), a.getWins());
                    if (cmp != 0) return cmp;
                    return a.getPlayerName().compareTo(b.getPlayerName());
                })
                .collect(Collectors.toList());
    }

    private Map<Long, Integer> resolveByeCounts(
            Long tournamentId,
            int totalRounds,
            Map<Long, int[]> stats,
            List<TournamentParticipant> participants) {
        if (!participants.isEmpty()) {
            Map<Long, Integer> byeCounts = new LinkedHashMap<>();
            for (TournamentParticipant participant : participants) {
                byeCounts.put(participant.getPlayer().getId(), participant.getByeCount());
            }
            return byeCounts;
        }

        // Legacy tournaments imported before roster persistence: infer unplayed rounds as byes.
        Map<Long, Integer> inferred = new LinkedHashMap<>();
        Set<Long> matchPlayerIds = new LinkedHashSet<>(stats.keySet());
        matchRepository.findDistinctWhitePlayersByTournamentId(tournamentId)
                .forEach(p -> matchPlayerIds.add(p.getId()));
        matchRepository.findDistinctBlackPlayersByTournamentId(tournamentId)
                .forEach(p -> matchPlayerIds.add(p.getId()));

        for (Long playerId : matchPlayerIds) {
            int gamesPlayed = stats.containsKey(playerId) ? stats.get(playerId)[3] : 0;
            inferred.put(playerId, Math.max(0, totalRounds - gamesPlayed));
        }
        return inferred;
    }

    private Set<Long> resolvePlayerUniverse(
            Long tournamentId,
            Map<Long, int[]> stats,
            Map<Long, Integer> byeCountsByPlayer) {
        Set<Long> playerIds = new LinkedHashSet<>();
        playerIds.addAll(byeCountsByPlayer.keySet());
        playerIds.addAll(stats.keySet());

        if (playerIds.isEmpty()) {
            matchRepository.findDistinctWhitePlayersByTournamentId(tournamentId)
                    .forEach(p -> playerIds.add(p.getId()));
            matchRepository.findDistinctBlackPlayersByTournamentId(tournamentId)
                    .forEach(p -> playerIds.add(p.getId()));
        }
        return playerIds;
    }

    private TournamentStandingEntry buildStandingEntry(
            Long playerId,
            Map<Long, String> names,
            Map<Long, int[]> stats,
            Map<Long, Integer> byeCountsByPlayer,
            Map<Long, double[]> tiebreaks) {
        int[] s = stats.getOrDefault(playerId, new int[4]);
        int matchWins = s[0];
        int draws = s[1];
        int losses = s[2];
        int matchRounds = s[3];
        int byes = byeCountsByPlayer.getOrDefault(playerId, 0);

        // BYEs count as wins (1 point each) — merge into wins and rounds played
        int totalWins = matchWins + byes;
        int totalGamesPlayed = matchRounds + byes;
        double points = totalWins + (draws * 0.5);

        double[] tb = tiebreaks.getOrDefault(playerId, new double[]{0.0, 0.0});
        double des2 = tb[0];
        double des3 = tb[1];

        String name = names.getOrDefault(playerId, lookupPlayerNameFromMatches(playerId));

        return new TournamentStandingEntry(
                playerId, name,
                points, totalWins, draws, losses,
                0, totalGamesPlayed,
                des2, des3);
    }

    private String lookupPlayerNameFromMatches(Long playerId) {
        return matchRepository.findByWhitePlayerIdOrBlackPlayerIdOrderByDateDesc(playerId, playerId)
                .stream()
                .findFirst()
                .map(m -> {
                    if (m.getWhitePlayer().getId().equals(playerId)) {
                        return m.getWhitePlayer().getFullName();
                    }
                    return m.getBlackPlayer().getFullName();
                })
                .orElse("Jugador #" + playerId);
    }

    public Tournament getTournamentOrThrow(Long id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found with id: " + id));
    }
}
