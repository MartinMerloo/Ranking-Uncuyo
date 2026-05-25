package ar.edu.uncuyo.ranking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ImportedPlayerSummary {

    private String fullName;
    private String clubCiudad;
    private String faculty;
    private String career;
    private int elo;
    private boolean isNew;

    public ImportedPlayerSummary() {
    }

    public ImportedPlayerSummary(
            String fullName,
            String clubCiudad,
            String faculty,
            String career,
            int elo,
            boolean isNew) {
        this.fullName = fullName;
        this.clubCiudad = clubCiudad;
        this.faculty = faculty;
        this.career = career;
        this.elo = elo;
        this.isNew = isNew;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getClubCiudad() {
        return clubCiudad;
    }

    public void setClubCiudad(String clubCiudad) {
        this.clubCiudad = clubCiudad;
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

    public int getElo() {
        return elo;
    }

    public void setElo(int elo) {
        this.elo = elo;
    }

    @JsonProperty("isNew")
    public boolean isNew() {
        return isNew;
    }

    public void setNew(boolean isNew) {
        this.isNew = isNew;
    }
}
