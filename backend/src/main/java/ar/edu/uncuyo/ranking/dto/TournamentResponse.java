package ar.edu.uncuyo.ranking.dto;

import ar.edu.uncuyo.ranking.model.Tournament;
import ar.edu.uncuyo.ranking.model.TournamentType;

import java.time.LocalDate;

public class TournamentResponse {

    private Long id;
    private String name;
    private LocalDate date;
    private TournamentType type;
    private int rounds;

    public static TournamentResponse from(Tournament tournament) {
        TournamentResponse response = new TournamentResponse();
        response.setId(tournament.getId());
        response.setName(tournament.getName());
        response.setDate(tournament.getDate());
        response.setType(tournament.getType());
        response.setRounds(tournament.getRounds());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public TournamentType getType() {
        return type;
    }

    public void setType(TournamentType type) {
        this.type = type;
    }

    public int getRounds() {
        return rounds;
    }

    public void setRounds(int rounds) {
        this.rounds = rounds;
    }
}
