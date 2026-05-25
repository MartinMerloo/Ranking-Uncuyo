package ar.edu.uncuyo.ranking.dto;

public class ClubMappingSuggestion {

    private String clubCiudad;
    private String faculty;
    private String career;

    public ClubMappingSuggestion() {
    }

    public ClubMappingSuggestion(String clubCiudad, String faculty, String career) {
        this.clubCiudad = clubCiudad;
        this.faculty = faculty;
        this.career = career;
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
}
