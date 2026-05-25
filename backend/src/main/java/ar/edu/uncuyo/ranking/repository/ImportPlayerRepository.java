package ar.edu.uncuyo.ranking.repository;

import ar.edu.uncuyo.ranking.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImportPlayerRepository extends JpaRepository<Player, Long> {
}
