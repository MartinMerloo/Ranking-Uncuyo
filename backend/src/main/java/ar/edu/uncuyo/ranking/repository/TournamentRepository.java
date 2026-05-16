package ar.edu.uncuyo.ranking.repository;

import ar.edu.uncuyo.ranking.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {

    List<Tournament> findAllByOrderByDateDesc();
}
