package ar.edu.uncuyo.ranking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ar.edu.uncuyo.ranking.dto.ImportResult;
import ar.edu.uncuyo.ranking.dto.TournamentRequest;
import ar.edu.uncuyo.ranking.dto.TournamentResponse;
import ar.edu.uncuyo.ranking.dto.TournamentStandingEntry;
import ar.edu.uncuyo.ranking.service.TournamentImportService;
import ar.edu.uncuyo.ranking.service.TournamentService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/tournaments")
public class TournamentController {

    private final TournamentService tournamentService;
    private final TournamentImportService tournamentImportService;

    public TournamentController(
            TournamentService tournamentService,
            TournamentImportService tournamentImportService) {
        this.tournamentService = tournamentService;
        this.tournamentImportService = tournamentImportService;
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

    @GetMapping("/{id}/standings")
    public List<TournamentStandingEntry> getStandings(@PathVariable Long id) {
        return tournamentService.getStandings(id);
    }

    @PostMapping(value = "/import-excel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ImportResult importFromExcel(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "classificationFile", required = false) MultipartFile classificationFile,
            @RequestParam(value = "mappings", required = false) String mappings,
            @RequestParam(value = "dryRun", defaultValue = "true") boolean dryRun) {
        return tournamentImportService.importFromExcel(file, classificationFile, mappings, dryRun);
    }
}
