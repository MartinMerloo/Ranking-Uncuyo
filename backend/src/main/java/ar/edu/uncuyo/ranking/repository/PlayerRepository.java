package ar.edu.uncuyo.ranking.repository;

import ar.edu.uncuyo.ranking.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    List<Player> findAllByOrderByEloRatingDescFullNameAsc();
}
