package ar.edu.uncuyo.ranking.dto;

import java.util.ArrayList;
import java.util.List;

public class ImportResult {

    private Long tournamentId;
    private String tournamentName;
    private int playersCreated;
    private int playersSkipped;
    private int matchesCreated;
    private int byeWinsApplied;
    private int rounds;
    private boolean preview;
    private boolean mappingsComplete;
    private boolean explicitAcademicColumns;
    private List<String> uniqueClubValues = new ArrayList<>();
    private List<ClubMappingSuggestion> clubSuggestions = new ArrayList<>();
    private List<ImportedPlayerSummary> playersList = new ArrayList<>();

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

    public int getPlayersCreated() {
        return playersCreated;
    }

    public void setPlayersCreated(int playersCreated) {
        this.playersCreated = playersCreated;
    }

    public int getPlayersSkipped() {
        return playersSkipped;
    }

    public void setPlayersSkipped(int playersSkipped) {
        this.playersSkipped = playersSkipped;
    }

    public int getMatchesCreated() {
        return matchesCreated;
    }

    public void setMatchesCreated(int matchesCreated) {
        this.matchesCreated = matchesCreated;
    }

    public int getByeWinsApplied() {
        return byeWinsApplied;
    }

    public void setByeWinsApplied(int byeWinsApplied) {
        this.byeWinsApplied = byeWinsApplied;
    }

    public int getRounds() {
        return rounds;
    }

    public void setRounds(int rounds) {
        this.rounds = rounds;
    }

    public boolean isPreview() {
        return preview;
    }

    public void setPreview(boolean preview) {
        this.preview = preview;
    }

    public boolean isMappingsComplete() {
        return mappingsComplete;
    }

    public void setMappingsComplete(boolean mappingsComplete) {
        this.mappingsComplete = mappingsComplete;
    }

    public boolean isExplicitAcademicColumns() {
        return explicitAcademicColumns;
    }

    public void setExplicitAcademicColumns(boolean explicitAcademicColumns) {
        this.explicitAcademicColumns = explicitAcademicColumns;
    }

    public List<String> getUniqueClubValues() {
        return uniqueClubValues;
    }

    public void setUniqueClubValues(List<String> uniqueClubValues) {
        this.uniqueClubValues = uniqueClubValues;
    }

    public List<ClubMappingSuggestion> getClubSuggestions() {
        return clubSuggestions;
    }

    public void setClubSuggestions(List<ClubMappingSuggestion> clubSuggestions) {
        this.clubSuggestions = clubSuggestions;
    }

    public List<ImportedPlayerSummary> getPlayersList() {
        return playersList;
    }

    public void setPlayersList(List<ImportedPlayerSummary> playersList) {
        this.playersList = playersList;
    }
}
