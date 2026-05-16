package ar.edu.uncuyo.ranking.controller;

import ar.edu.uncuyo.ranking.dto.MatchRequest;
import ar.edu.uncuyo.ranking.dto.MatchResponse;
import ar.edu.uncuyo.ranking.service.MatchService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/{id}")
    public MatchResponse getMatch(@PathVariable Long id) {
        return matchService.findById(id);
    }

    @GetMapping("/tournament/{tournamentId}")
    public List<MatchResponse> getMatchesByTournament(@PathVariable Long tournamentId) {
        return matchService.findByTournament(tournamentId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MatchResponse createMatch(@Valid @RequestBody MatchRequest request) {
        return matchService.create(request);
    }
}
