package ar.edu.uncuyo.ranking.service;

import ar.edu.uncuyo.ranking.dto.TournamentRequest;
import ar.edu.uncuyo.ranking.dto.TournamentResponse;
import ar.edu.uncuyo.ranking.dto.TournamentStandingEntry;
import ar.edu.uncuyo.ranking.exception.ResourceNotFoundException;
import ar.edu.uncuyo.ranking.model.Match;
import ar.edu.uncuyo.ranking.model.Tournament;
import ar.edu.uncuyo.ranking.repository.TournamentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;

    public TournamentService(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
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

    @Transactional(readOnly = true)
    public List<TournamentStandingEntry> getStandings(Long tournamentId) {
        Tournament tournament = getTournamentOrThrow(tournamentId);
        List<Match> matches = tournament.getMatches();
        int totalRounds = tournament.getRounds();

        // Accumulate per-player stats: [wins, draws, losses, gamesPlayed]
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

        return stats.entrySet().stream()
                .map(e -> {
                    Long pid = e.getKey();
                    int[] s = e.getValue();
                    int wins = s[0], draws = s[1], losses = s[2], gamesPlayed = s[3];
                    int byes = Math.max(0, totalRounds - gamesPlayed);
                    double points = wins + (draws * 0.5) + byes;
                    return new TournamentStandingEntry(
                            pid, names.get(pid),
                            points, wins, draws, losses,
                            byes, gamesPlayed);
                })
                .sorted(Comparator
                        .comparingDouble(TournamentStandingEntry::getPoints).reversed()
                        .thenComparingInt(TournamentStandingEntry::getWins).reversed())
                .collect(Collectors.toList());
    }

    public Tournament getTournamentOrThrow(Long id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found with id: " + id));
    }
}
