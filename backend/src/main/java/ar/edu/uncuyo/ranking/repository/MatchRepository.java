package ar.edu.uncuyo.ranking.repository;

import ar.edu.uncuyo.ranking.model.Match;
import ar.edu.uncuyo.ranking.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByTournamentIdOrderByRoundAscIdAsc(Long tournamentId);

    List<Match> findByWhitePlayerIdOrBlackPlayerIdOrderByDateDesc(Long whitePlayerId, Long blackPlayerId);

    boolean existsByWhitePlayerIdOrBlackPlayerId(Long whitePlayerId, Long blackPlayerId);

    @Query("SELECT DISTINCT m.whitePlayer FROM Match m WHERE m.tournament.id = :tournamentId")
    List<Player> findDistinctWhitePlayersByTournamentId(@Param("tournamentId") Long tournamentId);

    @Query("SELECT DISTINCT m.blackPlayer FROM Match m WHERE m.tournament.id = :tournamentId")
    List<Player> findDistinctBlackPlayersByTournamentId(@Param("tournamentId") Long tournamentId);
}
