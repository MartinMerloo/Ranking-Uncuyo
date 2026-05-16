package ar.edu.uncuyo.ranking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import ar.edu.uncuyo.ranking.dto.TournamentRequest;
import ar.edu.uncuyo.ranking.dto.TournamentResponse;
import ar.edu.uncuyo.ranking.service.TournamentService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/tournaments")
public class TournamentController {

    private final TournamentService tournamentService;

    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

    @GetMapping
    public List<TournamentResponse> getAllTournaments() {
        return tournamentService.findAll();
    }

    @GetMapping("/{id}")
    public TournamentResponse getTournament(@PathVariable Long id) {
        return tournamentService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TournamentResponse createTournament(@Valid @RequestBody TournamentRequest request) {
        return tournamentService.create(request);
    }
}
