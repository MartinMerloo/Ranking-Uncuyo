package ar.edu.uncuyo.ranking.dto;

import ar.edu.uncuyo.ranking.model.Match;
import ar.edu.uncuyo.ranking.model.MatchResult;

import java.time.LocalDate;

public class MatchResponse {

    private Long id;
    private Long tournamentId;
    private String tournamentName;
    private int round;
    private Long whitePlayerId;
    private String whitePlayerName;
    private Long blackPlayerId;
    private String blackPlayerName;
    private MatchResult result;
    private LocalDate date;

    public static MatchResponse from(Match match) {
        MatchResponse response = new MatchResponse();
        response.setId(match.getId());
        response.setTournamentId(match.getTournament().getId());
        response.setTournamentName(match.getTournament().getName());
        response.setRound(match.getRound());
        response.setWhitePlayerId(match.getWhitePlayer().getId());
        response.setWhitePlayerName(match.getWhitePlayer().getFullName());
        response.setBlackPlayerId(match.getBlackPlayer().getId());
        response.setBlackPlayerName(match.getBlackPlayer().getFullName());
        response.setResult(match.getResult());
        response.setDate(match.getDate());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTournamentId() {
        return tournamentId;
    }

    public void setTournamentId(Long tournamentId) {
        this.tournamentId = tournamentId;
    }

    public String getTournamentName() {
        return tournamentName;
    }

    public void setTournamentName(String tournamentName) {
        this.tournamentName = tournamentName;
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

    public String getWhitePlayerName() {
        return whitePlayerName;
    }

    public void setWhitePlayerName(String whitePlayerName) {
        this.whitePlayerName = whitePlayerName;
    }

    public Long getBlackPlayerId() {
        return blackPlayerId;
    }

    public void setBlackPlayerId(Long blackPlayerId) {
        this.blackPlayerId = blackPlayerId;
    }

    public String getBlackPlayerName() {
        return blackPlayerName;
    }

    public void setBlackPlayerName(String blackPlayerName) {
        this.blackPlayerName = blackPlayerName;
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
