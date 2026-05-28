package ar.edu.uncuyo.ranking.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ar.edu.uncuyo.ranking.dto.PlayerRequest;
import ar.edu.uncuyo.ranking.dto.PlayerResponse;
import ar.edu.uncuyo.ranking.exception.BadRequestException;
import ar.edu.uncuyo.ranking.exception.ResourceNotFoundException;
import ar.edu.uncuyo.ranking.model.Player;
import ar.edu.uncuyo.ranking.repository.MatchRepository;
import ar.edu.uncuyo.ranking.repository.PlayerRepository;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;
    private final EloCalculationService eloCalculationService;

    public PlayerService(
            PlayerRepository playerRepository,
            MatchRepository matchRepository,
            EloCalculationService eloCalculationService) {
        this.playerRepository = playerRepository;
        this.matchRepository = matchRepository;
        this.eloCalculationService = eloCalculationService;
    }

    @Transactional(readOnly = true)
    public List<PlayerResponse> findAll() {
        return playerRepository.findAllByOrderByEloRatingDescFullNameAsc().stream()
                .map(PlayerResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PlayerResponse findById(Long id) {
        return PlayerResponse.from(getPlayerOrThrow(id));
    }

    @Transactional
    public PlayerResponse create(PlayerRequest request) {
        Player player = new Player();

        player.setFullName(request.getFullName().trim());
        player.setFaculty(request.getFaculty().trim());
        player.setCareer(request.getCareer().trim());

        // Use imported Excel ELO if present, otherwise default initial rating
        player.setEloRating(
                request.getEloRating() != null
                        ? request.getEloRating()
                        : eloCalculationService.getInitialRating()
        );

        player.setWins(0);
        player.setByeWins(0);
        player.setLosses(0);
        player.setDraws(0);
        player.setGamesPlayed(0);

        return PlayerResponse.from(playerRepository.save(player));
    }

    @Transactional
    public PlayerResponse update(Long id, PlayerRequest request) {
        Player player = getPlayerOrThrow(id);

        player.setFullName(request.getFullName().trim());
        player.setFaculty(request.getFaculty().trim());
        player.setCareer(request.getCareer().trim());

        return PlayerResponse.from(playerRepository.save(player));
    }

    @Transactional
    public void delete(Long id) {
        Player player = getPlayerOrThrow(id);

        if (matchRepository.existsByWhitePlayerIdOrBlackPlayerId(id, id)) {
            throw new BadRequestException("No se puede eliminar un jugador con partidas registradas");
        }

        playerRepository.delete(player);
    }

    public Player getPlayerOrThrow(Long id) {
        return playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + id));
    }
}