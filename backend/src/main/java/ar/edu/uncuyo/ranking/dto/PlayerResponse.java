package ar.edu.uncuyo.ranking.dto;

import ar.edu.uncuyo.ranking.model.Player;

public class PlayerResponse {

    private Long id;
    private String fullName;
    private String faculty;
    private String career;
    private int eloRating;
    private int wins;
    private int byeWins;
    private int losses;
    private int draws;
    private int gamesPlayed;

    public static PlayerResponse from(Player player) {
        PlayerResponse response = new PlayerResponse();
        response.setId(player.getId());
        response.setFullName(player.getFullName());
        response.setFaculty(player.getFaculty());
        response.setCareer(player.getCareer());
        response.setEloRating(player.getEloRating());
        response.setWins(player.getWins());
        response.setByeWins(player.getByeWins());
        response.setLosses(player.getLosses());
        response.setDraws(player.getDraws());
        response.setGamesPlayed(player.getGamesPlayed());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
