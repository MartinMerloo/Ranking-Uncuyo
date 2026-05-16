package ar.edu.uncuyo.ranking.dto;

import ar.edu.uncuyo.ranking.model.TournamentType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class TournamentRequest {

    @NotBlank(message = "Tournament name is required")
    private String name;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Tournament type is required")
    private TournamentType type;

    @Min(value = 1, message = "Rounds must be at least 1")
    private int rounds;

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
