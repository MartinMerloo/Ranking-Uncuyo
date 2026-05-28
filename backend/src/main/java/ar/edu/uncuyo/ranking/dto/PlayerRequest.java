package ar.edu.uncuyo.ranking.dto;

import jakarta.validation.constraints.NotBlank;

public class PlayerRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Faculty is required")
    private String faculty;

    @NotBlank(message = "Career is required")
    private String career;

    // Optional: used when importing players from Excel
    private Integer eloRating;

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

    public Integer getEloRating() {
        return eloRating;
    }

    public void setEloRating(Integer eloRating) {
        this.eloRating = eloRating;
    }
}