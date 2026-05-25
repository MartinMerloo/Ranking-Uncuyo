package ar.edu.uncuyo.ranking.dto;

public class ClubCareerMapping {

    private String faculty;
    private String career;

    public ClubCareerMapping() {
    }

    public ClubCareerMapping(String faculty, String career) {
        this.faculty = faculty;
        this.career = career;
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

    public boolean isComplete() {
        return faculty != null && !faculty.isBlank() && career != null && !career.isBlank();
    }
}
