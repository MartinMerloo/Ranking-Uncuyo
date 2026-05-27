package ar.edu.uncuyo.ranking.dto;

public class TournamentStandingEntry {

    private Long playerId;
    private String playerName;
    private double points;
    private int wins;
    private int draws;
    private int losses;
    private int byes;
    private int gamesPlayed;

    public TournamentStandingEntry(
            Long playerId, String playerName,
            double points, int wins, int draws, int losses,
            int byes, int gamesPlayed) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.points = points;
        this.wins = wins;
        this.draws = draws;
        this.losses = losses;
        this.byes = byes;
        this.gamesPlayed = gamesPlayed;
    }

    public Long getPlayerId()    { return playerId; }
    public String getPlayerName(){ return playerName; }
    public double getPoints()    { return points; }
    public int getWins()         { return wins; }
    public int getDraws()        { return draws; }
    public int getLosses()       { return losses; }
    public int getByes()         { return byes; }
    public int getGamesPlayed()  { return gamesPlayed; }
}
