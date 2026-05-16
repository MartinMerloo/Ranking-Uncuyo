package ar.edu.uncuyo.ranking.service;

import ar.edu.uncuyo.ranking.dto.RankingEntryResponse;
import ar.edu.uncuyo.ranking.model.Player;
import ar.edu.uncuyo.ranking.repository.PlayerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Ranking is computed dynamically from player ELO ratings (not stored in the database).
 */
@Service
public class RankingService {

    private final PlayerRepository playerRepository;

    public RankingService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Transactional(readOnly = true)
    public List<RankingEntryResponse> getRanking() {
        List<Player> players = playerRepository.findAllByOrderByEloRatingDescFullNameAsc();
        List<RankingEntryResponse> ranking = new ArrayList<>();

        int position = 1;
        for (Player player : players) {
            ranking.add(RankingEntryResponse.from(position++, player));
        }
        return ranking;
    }
}
