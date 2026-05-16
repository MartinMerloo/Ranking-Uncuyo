package ar.edu.uncuyo.ranking.service;

import ar.edu.uncuyo.ranking.dto.TournamentRequest;
import ar.edu.uncuyo.ranking.dto.TournamentResponse;
import ar.edu.uncuyo.ranking.exception.ResourceNotFoundException;
import ar.edu.uncuyo.ranking.model.Tournament;
import ar.edu.uncuyo.ranking.repository.TournamentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;

    public TournamentService(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }

    @Transactional(readOnly = true)
    public List<TournamentResponse> findAll() {
        return tournamentRepository.findAllByOrderByDateDesc().stream()
                .map(TournamentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public TournamentResponse findById(Long id) {
        return TournamentResponse.from(getTournamentOrThrow(id));
    }

    @Transactional
    public TournamentResponse create(TournamentRequest request) {
        Tournament tournament = new Tournament();
        tournament.setName(request.getName().trim());
        tournament.setDate(request.getDate());
        tournament.setType(request.getType());
        tournament.setRounds(request.getRounds());
        return TournamentResponse.from(tournamentRepository.save(tournament));
    }

    public Tournament getTournamentOrThrow(Long id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found with id: " + id));
    }
}
