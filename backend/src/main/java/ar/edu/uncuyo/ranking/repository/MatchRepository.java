package ar.edu.uncuyo.ranking.repository;

import ar.edu.uncuyo.ranking.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByTournamentIdOrderByRoundAscIdAsc(Long tournamentId);

    List<Match> findByWhitePlayerIdOrBlackPlayerIdOrderByDateDesc(Long whitePlayerId, Long blackPlayerId);

    boolean existsByWhitePlayerIdOrBlackPlayerId(Long whitePlayerId, Long blackPlayerId);
}
