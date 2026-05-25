package ar.edu.uncuyo.ranking.service;

import ar.edu.uncuyo.ranking.dto.PlayerRequest;
import ar.edu.uncuyo.ranking.dto.PlayerResponse;
import ar.edu.uncuyo.ranking.exception.ResourceNotFoundException;
import ar.edu.uncuyo.ranking.model.Player;
import ar.edu.uncuyo.ranking.repository.PlayerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final EloCalculationService eloCalculationService;

    public PlayerService(PlayerRepository playerRepository, EloCalculationService eloCalculationService) {
        this.playerRepository = playerRepository;
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
        player.setEloRating(eloCalculationService.getInitialRating());
        player.setWins(0);
        player.setByeWins(0);
        player.setLosses(0);
        player.setDraws(0);
        player.setGamesPlayed(0);
        return PlayerResponse.from(playerRepository.save(player));
    }

    public Player getPlayerOrThrow(Long id) {
        return playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + id));
    }
}
