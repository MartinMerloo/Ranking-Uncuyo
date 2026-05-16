package ar.edu.uncuyo.ranking.service;

import ar.edu.uncuyo.ranking.dto.MatchRequest;
import ar.edu.uncuyo.ranking.dto.MatchResponse;
import ar.edu.uncuyo.ranking.exception.BadRequestException;
import ar.edu.uncuyo.ranking.exception.ResourceNotFoundException;
import ar.edu.uncuyo.ranking.model.Match;
import ar.edu.uncuyo.ranking.model.Player;
import ar.edu.uncuyo.ranking.model.Tournament;
import ar.edu.uncuyo.ranking.repository.MatchRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MatchService {

    private final MatchRepository matchRepository;
    private final PlayerService playerService;
    private final TournamentService tournamentService;
    private final EloCalculationService eloCalculationService;

    public MatchService(
            MatchRepository matchRepository,
            PlayerService playerService,
            TournamentService tournamentService,
            EloCalculationService eloCalculationService) {
        this.matchRepository = matchRepository;
        this.playerService = playerService;
        this.tournamentService = tournamentService;
        this.eloCalculationService = eloCalculationService;
    }

    @Transactional(readOnly = true)
    public List<MatchResponse> findByTournament(Long tournamentId) {
        tournamentService.getTournamentOrThrow(tournamentId);
        return matchRepository.findByTournamentIdOrderByRoundAscIdAsc(tournamentId).stream()
                .map(MatchResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public MatchResponse findById(Long id) {
        return MatchResponse.from(getMatchOrThrow(id));
    }

    @Transactional
    public MatchResponse create(MatchRequest request) {
        validateMatchRequest(request);

        Tournament tournament = tournamentService.getTournamentOrThrow(request.getTournamentId());
        Player white = playerService.getPlayerOrThrow(request.getWhitePlayerId());
        Player black = playerService.getPlayerOrThrow(request.getBlackPlayerId());

        if (request.getRound() > tournament.getRounds()) {
            throw new BadRequestException(
                    "Round " + request.getRound() + " exceeds tournament rounds (" + tournament.getRounds() + ")");
        }

        eloCalculationService.applyMatchResult(white, black, request.getResult());

        Match match = new Match();
        match.setTournament(tournament);
        match.setRound(request.getRound());
        match.setWhitePlayer(white);
        match.setBlackPlayer(black);
        match.setResult(request.getResult());
        match.setDate(request.getDate());

        Match saved = matchRepository.save(match);
        return MatchResponse.from(saved);
    }

    private void validateMatchRequest(MatchRequest request) {
        if (request.getWhitePlayerId().equals(request.getBlackPlayerId())) {
            throw new BadRequestException("White and black players must be different");
        }
    }

    private Match getMatchOrThrow(Long id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + id));
    }
}
