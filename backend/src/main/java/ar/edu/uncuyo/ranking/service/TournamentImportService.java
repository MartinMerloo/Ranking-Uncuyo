package ar.edu.uncuyo.ranking.service;

import ar.edu.uncuyo.ranking.dto.ClubCareerMapping;
import ar.edu.uncuyo.ranking.dto.ClubMappingSuggestion;
import ar.edu.uncuyo.ranking.dto.ImportResult;
import ar.edu.uncuyo.ranking.dto.ImportedPlayerSummary;
import ar.edu.uncuyo.ranking.dto.MatchRequest;
import ar.edu.uncuyo.ranking.dto.PlayerRequest;
import ar.edu.uncuyo.ranking.dto.TournamentRequest;
import ar.edu.uncuyo.ranking.exception.BadRequestException;
import ar.edu.uncuyo.ranking.model.MatchResult;
import ar.edu.uncuyo.ranking.model.Player;
import ar.edu.uncuyo.ranking.model.TournamentType;
import ar.edu.uncuyo.ranking.repository.ImportPlayerRepository;
import ar.edu.uncuyo.ranking.service.CrossTableExcelParser.ParsedCrossTable;
import ar.edu.uncuyo.ranking.service.CrossTableExcelParser.ParsedPlayer;
import ar.edu.uncuyo.ranking.service.CrossTableExcelParser.ParsedRoundResult;
import ar.edu.uncuyo.ranking.service.CrossTableExcelParser.ParsedRoundResultData;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TournamentImportService {

    private final CrossTableExcelParser crossTableExcelParser;
    private final ClubCiudadParser clubCiudadParser;
    private final ImportPlayerRepository importPlayerRepository;
    private final PlayerService playerService;
    private final TournamentService tournamentService;
    private final MatchService matchService;
    private final EloCalculationService eloCalculationService;
    private final ObjectMapper objectMapper;

    public TournamentImportService(
            CrossTableExcelParser crossTableExcelParser,
            ClubCiudadParser clubCiudadParser,
            ImportPlayerRepository importPlayerRepository,
            PlayerService playerService,
            TournamentService tournamentService,
            MatchService matchService,
            EloCalculationService eloCalculationService,
            ObjectMapper objectMapper) {
        this.crossTableExcelParser = crossTableExcelParser;
        this.clubCiudadParser = clubCiudadParser;
        this.importPlayerRepository = importPlayerRepository;
        this.playerService = playerService;
        this.tournamentService = tournamentService;
        this.matchService = matchService;
        this.eloCalculationService = eloCalculationService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ImportResult importFromExcel(
            MultipartFile crossTableFile,
            MultipartFile classificationFile,
            String mappingsJson,
            boolean dryRun) {
        ParsedCrossTable parsed = crossTableExcelParser.parse(crossTableFile, classificationFile);
        boolean explicitAcademic = parsed.hasExplicitAcademicColumns();
        List<String> uniqueClubs = explicitAcademic ? List.of() : collectUniqueClubs(parsed);
        Map<String, ClubCareerMapping> mappings = parseMappings(mappingsJson);
        boolean mappingsComplete = explicitAcademic
                ? areExplicitAcademicDataComplete(parsed)
                : areMappingsComplete(uniqueClubs, mappings);

        ImportResult result = new ImportResult();
        result.setPreview(dryRun);
        result.setTournamentName(parsed.tournamentName());
        result.setRounds(parsed.rounds());
        result.setExplicitAcademicColumns(explicitAcademic);
        result.setUniqueClubValues(uniqueClubs);
        result.setClubSuggestions(explicitAcademic ? List.of() : buildSuggestions(uniqueClubs));
        result.setMappingsComplete(mappingsComplete);

        if (!mappingsComplete) {
            return result;
        }

        ImportPlan plan = buildPlan(parsed, mappings, explicitAcademic);
        result.setPlayersCreated(plan.playersCreated());
        result.setPlayersSkipped(plan.playersSkipped());
        result.setMatchesCreated(plan.matchesToCreate());
        result.setByeWinsApplied(plan.byeWinsToApply());
        result.setPlayersList(plan.playerSummaries());

        if (dryRun) {
            return result;
        }

        Map<Integer, Player> seedToPlayer = persistPlayers(plan);
        Long tournamentId = createTournament(plan);
        registerTournamentParticipants(tournamentId, plan, seedToPlayer);
        int matchesCreated = createMatches(plan, seedToPlayer, tournamentId);
        int byeWinsApplied = applyByeWins(plan, seedToPlayer);

        result.setTournamentId(tournamentId);
        result.setMatchesCreated(matchesCreated);
        result.setByeWinsApplied(byeWinsApplied);
        return result;
    }

    private List<String> collectUniqueClubs(ParsedCrossTable parsed) {
        Set<String> clubs = new LinkedHashSet<>();
        for (ParsedPlayer player : parsed.players()) {
            clubs.add(normalizeClubKey(player.clubCiudad()));
        }
        return new ArrayList<>(clubs);
    }

    private List<ClubMappingSuggestion> buildSuggestions(List<String> uniqueClubs) {
        return uniqueClubs.stream()
                .map(club -> {
                    ClubCiudadParser.ParsedClubCiudad parsed = clubCiudadParser.parse(club);
                    return new ClubMappingSuggestion(club, parsed.faculty(), parsed.career());
                })
                .toList();
    }

    private Map<String, ClubCareerMapping> parseMappings(String mappingsJson) {
        if (mappingsJson == null || mappingsJson.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(mappingsJson, new TypeReference<Map<String, ClubCareerMapping>>() {});
        } catch (Exception ex) {
            throw new BadRequestException("Invalid mappings JSON: " + ex.getMessage());
        }
    }

    private boolean areMappingsComplete(List<String> uniqueClubs, Map<String, ClubCareerMapping> mappings) {
        for (String club : uniqueClubs) {
            ClubCareerMapping mapping = mappings.get(club);
            if (mapping == null || !mapping.isComplete()) {
                return false;
            }
        }
        return true;
    }

    private boolean areExplicitAcademicDataComplete(ParsedCrossTable parsed) {
        for (ParsedPlayer player : parsed.players()) {
            if (player.faculty() == null || player.faculty().isBlank()
                    || player.career() == null || player.career().isBlank()) {
                return false;
            }
        }
        return true;
    }

    private String normalizeClubKey(String clubCiudad) {
        return clubCiudad == null ? "" : clubCiudad.trim();
    }

    private ImportPlan buildPlan(
            ParsedCrossTable parsed,
            Map<String, ClubCareerMapping> mappings,
            boolean explicitAcademic) {
        Map<String, Player> playersByNormalizedName = indexExistingPlayers();
        Set<String> newNamesScheduledInImport = new HashSet<>();
        int playersCreated = 0;
        int playersSkipped = 0;
        List<ResolvedPlayer> resolvedPlayers = new ArrayList<>();

        for (ParsedPlayer parsedPlayer : parsed.players()) {
            String faculty;
            String career;
            if (explicitAcademic) {
                faculty = parsedPlayer.faculty().trim();
                career = parsedPlayer.career().trim();
            } else {
                String clubKey = normalizeClubKey(parsedPlayer.clubCiudad());
                ClubCareerMapping mapping = mappings.get(clubKey);
                if (mapping == null) {
                    throw new BadRequestException("Missing mapping for club/ciudad: " + clubLabel(clubKey));
                }
                faculty = mapping.getFaculty().trim();
                career = mapping.getCareer().trim();
            }

            String normalizedName = PlayerNameNormalizer.normalize(parsedPlayer.fullName());

            Player existingPlayer = playersByNormalizedName.get(normalizedName);
            boolean isNew;

            if (existingPlayer != null) {
                isNew = false;
                playersSkipped++;
            } else if (newNamesScheduledInImport.contains(normalizedName)) {
                isNew = false;
                playersSkipped++;
            } else {
                isNew = true;
                playersCreated++;
                newNamesScheduledInImport.add(normalizedName);
            }

            int displayElo = existingPlayer != null ? existingPlayer.getEloRating() : parsedPlayer.excelElo();

            resolvedPlayers.add(new ResolvedPlayer(
                    parsedPlayer,
                    existingPlayer,
                    isNew,
                    displayElo,
                    faculty,
                    career));
        }

        int matchesToCreate = countMatches(parsed, resolvedPlayers);
        int byeWinsToApply = countByeWins(parsed);

        return new ImportPlan(
                parsed.tournamentName(),
                parsed.rounds(),
                parsed.players(),
                resolvedPlayers,
                playersCreated,
                playersSkipped,
                matchesToCreate,
                byeWinsToApply);
    }

    private int countByeWins(ParsedCrossTable parsed) {
        int count = 0;
        for (ParsedPlayer player : parsed.players()) {
            count += player.byeRounds().size();
        }
        return count;
    }

    private int countMatches(ParsedCrossTable parsed, List<ResolvedPlayer> resolvedPlayers) {
        Map<Integer, ResolvedPlayer> bySeed = resolvedPlayers.stream()
                .collect(Collectors.toMap(r -> r.parsedPlayer().seed(), r -> r));

        int count = 0;
        for (ParsedPlayer parsedPlayer : parsed.players()) {
            for (ParsedRoundResult roundResult : parsedPlayer.roundResults()) {
                ParsedRoundResultData data = roundResult.data();
                if (parsedPlayer.seed() >= data.opponentSeed()) {
                    continue;
                }
                if (!bySeed.containsKey(data.opponentSeed())) {
                    continue;
                }
                count++;
            }
        }
        return count;
    }

    private Map<Integer, Player> persistPlayers(ImportPlan plan) {
        Map<String, Player> playersByNormalizedName = indexExistingPlayers();
        Map<Integer, Player> seedToPlayer = new HashMap<>();

        for (ResolvedPlayer resolved : plan.resolvedPlayers()) {
            String normalizedName = PlayerNameNormalizer.normalize(resolved.parsedPlayer().fullName());
            Player player = playersByNormalizedName.get(normalizedName);

            if (player == null) {
                PlayerRequest request = new PlayerRequest();
                request.setFullName(resolved.parsedPlayer().fullName());
                request.setFaculty(resolved.faculty());
                request.setCareer(resolved.career());
                Long newId = playerService.create(request).getId();
                player = importPlayerRepository.findById(newId)
                        .orElseThrow(() -> new BadRequestException("Failed to create player"));
                playersByNormalizedName.put(normalizedName, player);
            }

            seedToPlayer.put(resolved.parsedPlayer().seed(), player);
        }
        return seedToPlayer;
    }

    /**
     * Loads all players indexed by normalized full name (case/space insensitive).
     */
    private Map<String, Player> indexExistingPlayers() {
        Map<String, Player> index = new HashMap<>();
        for (Player player : importPlayerRepository.findAll()) {
            index.putIfAbsent(PlayerNameNormalizer.normalize(player.getFullName()), player);
        }
        return index;
    }

    private void registerTournamentParticipants(
            Long tournamentId,
            ImportPlan plan,
            Map<Integer, Player> seedToPlayer) {
        Map<Player, Integer> playerByeCounts = new LinkedHashMap<>();
        for (ResolvedPlayer resolved : plan.resolvedPlayers()) {
            Player player = seedToPlayer.get(resolved.parsedPlayer().seed());
            if (player == null) {
                continue;
            }
            playerByeCounts.put(player, resolved.parsedPlayer().byeRounds().size());
        }
        tournamentService.registerImportedParticipants(tournamentId, playerByeCounts);
    }

    private Long createTournament(ImportPlan plan) {
        TournamentRequest request = new TournamentRequest();
        request.setName(plan.tournamentName());
        request.setDate(LocalDate.now());
        request.setType(TournamentType.RAPID);
        request.setRounds(plan.rounds());
        return tournamentService.create(request).getId();
    }

    private int createMatches(ImportPlan plan, Map<Integer, Player> seedToPlayer, Long tournamentId) {
        LocalDate today = LocalDate.now();
        int created = 0;

        for (ResolvedPlayer resolved : plan.resolvedPlayers()) {
            ParsedPlayer parsedPlayer = resolved.parsedPlayer();
            Player currentPlayer = seedToPlayer.get(parsedPlayer.seed());

            for (ParsedRoundResult roundResult : parsedPlayer.roundResults()) {
                ParsedRoundResultData data = roundResult.data();
                if (parsedPlayer.seed() >= data.opponentSeed()) {
                    continue;
                }

                Player opponent = seedToPlayer.get(data.opponentSeed());
                if (opponent == null) {
                    continue;
                }

                Player white;
                Player black;
                if (data.color() == 'w') {
                    white = currentPlayer;
                    black = opponent;
                } else {
                    white = opponent;
                    black = currentPlayer;
                }

                MatchResult matchResult = crossTableExcelParser.toMatchResult(data.color(), data.playerScore());

                MatchRequest matchRequest = new MatchRequest();
                matchRequest.setTournamentId(tournamentId);
                matchRequest.setRound(roundResult.round());
                matchRequest.setWhitePlayerId(white.getId());
                matchRequest.setBlackPlayerId(black.getId());
                matchRequest.setResult(matchResult);
                matchRequest.setDate(today);

                matchService.create(matchRequest);
                created++;
            }
        }

        return created;
    }

    private int applyByeWins(ImportPlan plan, Map<Integer, Player> seedToPlayer) {
        int applied = 0;
        for (ResolvedPlayer resolved : plan.resolvedPlayers()) {
            ParsedPlayer parsedPlayer = resolved.parsedPlayer();
            if (parsedPlayer.byeRounds().isEmpty()) {
                continue;
            }
            Player player = seedToPlayer.get(parsedPlayer.seed());
            if (player == null) {
                continue;
            }
            int byeCount = parsedPlayer.byeRounds().size();
            for (int i = 0; i < byeCount; i++) {
                eloCalculationService.applyByeWin(player);
            }
            applied += byeCount;
            importPlayerRepository.save(player);
        }
        return applied;
    }

    private record ResolvedPlayer(
            ParsedPlayer parsedPlayer,
            Player existingPlayer,
            boolean isNew,
            int displayElo,
            String faculty,
            String career) {
    }

    private record ImportPlan(
            String tournamentName,
            int rounds,
            List<ParsedPlayer> parsedPlayers,
            List<ResolvedPlayer> resolvedPlayers,
            int playersCreated,
            int playersSkipped,
            int matchesToCreate,
            int byeWinsToApply) {

        List<ImportedPlayerSummary> playerSummaries() {
            return resolvedPlayers.stream()
                    .map(resolved -> new ImportedPlayerSummary(
                            resolved.parsedPlayer().fullName(),
                            normalizeClub(resolved.parsedPlayer().clubCiudad()),
                            resolved.faculty(),
                            resolved.career(),
                            resolved.displayElo(),
                            resolved.isNew()))
                    .toList();
        }

        private static String normalizeClub(String clubCiudad) {
            return clubCiudad == null ? "" : clubCiudad.trim();
        }
    }

    private static String clubLabel(String clubKey) {
        return clubKey == null || clubKey.isBlank() ? "(Sin club/ciudad)" : clubKey;
    }
}
