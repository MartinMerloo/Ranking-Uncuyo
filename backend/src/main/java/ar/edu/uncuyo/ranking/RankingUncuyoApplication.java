package ar.edu.uncuyo.ranking;

import ar.edu.uncuyo.ranking.config.EloProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(EloProperties.class)
public class RankingUncuyoApplication {

    public static void main(String[] args) {
        SpringApplication.run(RankingUncuyoApplication.class, args);
    }
}
