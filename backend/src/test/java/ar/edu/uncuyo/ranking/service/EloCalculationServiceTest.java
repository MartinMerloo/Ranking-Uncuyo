package ar.edu.uncuyo.ranking.service;

import ar.edu.uncuyo.ranking.config.EloProperties;
import ar.edu.uncuyo.ranking.model.MatchResult;
import ar.edu.uncuyo.ranking.model.Player;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class EloCalculationServiceTest {

    private EloCalculationService eloService;

    @BeforeEach
    void setUp() {
        EloProperties properties = new EloProperties();
        properties.setInitialRating(1200);
        properties.setKFactor(32);
        eloService = new EloCalculationService(properties);
    }

    @Test
    void equalRatings_expectedScoreIsHalf() {
        assertEquals(0.5, eloService.expectedScore(1200, 1200), 0.001);
    }

    @Test
    void higherRatedPlayerHasHigherExpectedScore() {
        assertTrue(eloService.expectedScore(1400, 1200) > 0.5);
    }

    @Test
    void whiteWinIncreasesWhiteRatingAndDecreasesBlack() {
        Player white = player(1200);
        Player black = player(1200);

        eloService.applyMatchResult(white, black, MatchResult.WHITE_WIN);

        assertTrue(white.getEloRating() > 1200);
        assertTrue(black.getEloRating() < 1200);
        assertEquals(1, white.getWins());
        assertEquals(1, black.getLosses());
    }

    @Test
    void drawUpdatesBothPlayersWithSmallChange() {
        Player white = player(1200);
        Player black = player(1200);

        eloService.applyMatchResult(white, black, MatchResult.DRAW);

        assertEquals(1200, white.getEloRating());
        assertEquals(1200, black.getEloRating());
        assertEquals(1, white.getDraws());
        assertEquals(1, black.getDraws());
    }

    private Player player(int rating) {
        Player player = new Player();
        player.setEloRating(rating);
        player.setWins(0);
        player.setLosses(0);
        player.setDraws(0);
        player.setGamesPlayed(0);
        return player;
    }
}
