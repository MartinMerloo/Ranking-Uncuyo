package ar.edu.uncuyo.ranking.repository;

import ar.edu.uncuyo.ranking.model.TournamentParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentParticipantRepository extends JpaRepository<TournamentParticipant, Long> {

    List<TournamentParticipant> findByTournamentId(Long tournamentId);

    boolean existsByTournamentId(Long tournamentId);
}
