package ar.edu.uncuyo.ranking.dto;

import ar.edu.uncuyo.ranking.model.Player;

public class RankingEntryResponse {

    private int position;
    private Long playerId;
    private String fullName;
    private String faculty;
    private String career;
    private int eloRating;
    private int wins;
    private int byeWins;
    private int losses;
    private int draws;
    private int gamesPlayed;

    public static RankingEntryResponse from(int position, Player player) {
        RankingEntryResponse entry = new RankingEntryResponse();
        entry.setPosition(position);
        entry.setPlayerId(player.getId());
        entry.setFullName(player.getFullName());
        entry.setFaculty(player.getFaculty());
        entry.setCareer(player.getCareer());
        entry.setEloRating(player.getEloRating());
        entry.setWins(player.getWins());
        entry.setByeWins(player.getByeWins());
        entry.setLosses(player.getLosses());
        entry.setDraws(player.getDraws());
        entry.setGamesPlayed(player.getGamesPlayed());
        return entry;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public String getCareer() {
        return career;
    }

    public void setCareer(String career) {
        this.career = career;
    }

    public int getEloRating() {
        return eloRating;
    }

    public void setEloRating(int eloRating) {
        this.eloRating = eloRating;
    }

    public int getWins() {
        return wins;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }

    public int getByeWins() {
        return byeWins;
    }

    public void setByeWins(int byeWins) {
        this.byeWins = byeWins;
    }

    public int getLosses() {
        return losses;
    }

    public void setLosses(int losses) {
        this.losses = losses;
    }

    public int getDraws() {
        return draws;
    }

    public void setDraws(int draws) {
        this.draws = draws;
    }

    public int getGamesPlayed() {
        return gamesPlayed;
    }

    public void setGamesPlayed(int gamesPlayed) {
        this.gamesPlayed = gamesPlayed;
    }
}
