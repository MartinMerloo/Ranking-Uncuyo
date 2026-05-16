package ar.edu.uncuyo.ranking.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ranking.elo")
public class EloProperties {

    private int initialRating = 1400;
    private int kFactor = 32;

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
}
