package ar.edu.uncuyo.ranking.service;

import ar.edu.uncuyo.ranking.config.EloProperties;
import ar.edu.uncuyo.ranking.model.MatchResult;
import ar.edu.uncuyo.ranking.model.Player;
import org.springframework.stereotype.Service;

/**
 * Standard ELO rating calculations.
 * <p>
 * NewRating = CurrentRating + K * (Score - ExpectedScore)
 * ExpectedScore = 1 / (1 + 10^((OpponentRating - PlayerRating) / 400))
 */
@Service
public class EloCalculationService {

    private final EloProperties eloProperties;

    public EloCalculationService(EloProperties eloProperties) {
        this.eloProperties = eloProperties;
    }

    public int getInitialRating() {
        return eloProperties.getInitialRating();
    }

    public double expectedScore(int playerRating, int opponentRating) {
        double exponent = (opponentRating - playerRating) / 400.0;
        return 1.0 / (1.0 + Math.pow(10, exponent));
    }

    public int calculateNewRating(int currentRating, int opponentRating, double actualScore) {
        double expected = expectedScore(currentRating, opponentRating);
        double change = eloProperties.getKFactor() * (actualScore - expected);
        return (int) Math.round(currentRating + change);
    }

    public double scoreForWhite(MatchResult result) {
        return switch (result) {
            case WHITE_WIN -> 1.0;
            case DRAW -> 0.5;
            case BLACK_WIN -> 0.0;
        };
    }

    public double scoreForBlack(MatchResult result) {
        return 1.0 - scoreForWhite(result);
    }

    /**
     * Updates both players' ELO ratings and win/loss/draw statistics after a match.
     */
    public void applyMatchResult(Player white, Player black, MatchResult result) {
        int whiteRating = white.getEloRating();
        int blackRating = black.getEloRating();

        double whiteScore = scoreForWhite(result);
        double blackScore = scoreForBlack(result);

        white.setEloRating(calculateNewRating(whiteRating, blackRating, whiteScore));
        black.setEloRating(calculateNewRating(blackRating, whiteRating, blackScore));

        white.setGamesPlayed(white.getGamesPlayed() + 1);
        black.setGamesPlayed(black.getGamesPlayed() + 1);

        switch (result) {
            case WHITE_WIN -> {
                white.setWins(white.getWins() + 1);
                black.setLosses(black.getLosses() + 1);
            }
            case BLACK_WIN -> {
                white.setLosses(white.getLosses() + 1);
                black.setWins(black.getWins() + 1);
            }
            case DRAW -> {
                white.setDraws(white.getDraws() + 1);
                black.setDraws(black.getDraws() + 1);
            }
        }
    }
}
