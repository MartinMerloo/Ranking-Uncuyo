package ar.edu.uncuyo.ranking.dto;

import ar.edu.uncuyo.ranking.model.MatchResult;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class MatchRequest {

    @NotNull(message = "Tournament id is required")
    private Long tournamentId;

    @Min(value = 1, message = "Round must be at least 1")
    private int round;

    @NotNull(message = "White player id is required")
    private Long whitePlayerId;

    @NotNull(message = "Black player id is required")
    private Long blackPlayerId;

    @NotNull(message = "Result is required")
    private MatchResult result;

    @NotNull(message = "Date is required")
    private LocalDate date;

    public Long getTournamentId() {
        return tournamentId;
    }

    public void setTournamentId(Long tournamentId) {
        this.tournamentId = tournamentId;
    }

    public int getRound() {
        return round;
    }

    public void setRound(int round) {
        this.round = round;
    }

    public Long getWhitePlayerId() {
        return whitePlayerId;
    }

    public void setWhitePlayerId(Long whitePlayerId) {
        this.whitePlayerId = whitePlayerId;
    }

    public Long getBlackPlayerId() {
        return blackPlayerId;
    }

    public void setBlackPlayerId(Long blackPlayerId) {
        this.blackPlayerId = blackPlayerId;
    }

    public MatchResult getResult() {
        return result;
    }

    public void setResult(MatchResult result) {
        this.result = result;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
