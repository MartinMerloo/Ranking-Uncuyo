package ar.edu.uncuyo.ranking.controller;

import ar.edu.uncuyo.ranking.dto.PlayerRequest;
import ar.edu.uncuyo.ranking.dto.PlayerResponse;
import ar.edu.uncuyo.ranking.service.PlayerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/players")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping
    public List<PlayerResponse> getAllPlayers() {
        return playerService.findAll();
    }

    @GetMapping("/{id}")
    public PlayerResponse getPlayer(@PathVariable Long id) {
        return playerService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlayerResponse createPlayer(@Valid @RequestBody PlayerRequest request) {
        return playerService.create(request);
    }

    @PutMapping("/{id}")
    public PlayerResponse updatePlayer(@PathVariable Long id, @Valid @RequestBody PlayerRequest request) {
        return playerService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlayer(@PathVariable Long id) {
        playerService.delete(id);
    }
}
