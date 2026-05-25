package ar.edu.uncuyo.ranking.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ranking.elo")
public class EloProperties {

    public static final int DEFAULT_INITIAL_RATING = 1400;
    public static final int DEFAULT_K_FACTOR = 40;
    public static final int DEFAULT_MINIMUM_RATING = 1400;

    private int initialRating = DEFAULT_INITIAL_RATING;
    private int kFactor = DEFAULT_K_FACTOR;
    private int minimumRating = DEFAULT_MINIMUM_RATING;

    public int getInitialRating() {
        return initialRating;
    }

    public void setInitialRating(int initialRating) {
        this.initialRating = initialRating;
    }

    public int getKFactor() {
        return kFactor;
    }

    public void setKFactor(int kFactor) {
        this.kFactor = kFactor;
    }

    public int getMinimumRating() {
        return minimumRating;
    }

    public void setMinimumRating(int minimumRating) {
        this.minimumRating = minimumRating;
    }

    /** K-factor used in all ELO calculations (single source of truth). */
    public int kFactorForCalculation() {
        return DEFAULT_K_FACTOR;
    }

    /** Minimum ELO floor applied after every rating change. */
    public int minimumRatingFloor() {
        return DEFAULT_MINIMUM_RATING;
    }

    /** Starting rating for newly created players. */
    public int initialRatingForNewPlayers() {
        return DEFAULT_INITIAL_RATING;
    }
}
