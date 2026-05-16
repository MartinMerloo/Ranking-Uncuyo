package ar.edu.uncuyo.ranking.controller;

import ar.edu.uncuyo.ranking.dto.RankingEntryResponse;
import ar.edu.uncuyo.ranking.service.RankingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ranking")
public class RankingController {

    private final RankingService rankingService;

    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    @GetMapping
    public List<RankingEntryResponse> getRanking() {
        return rankingService.getRanking();
    }
}
