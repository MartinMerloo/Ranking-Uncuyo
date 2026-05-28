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
    private double des2;
    private double des3;

    public TournamentStandingEntry(
            Long playerId, String playerName,
            double points, int wins, int draws, int losses,
            int byes, int gamesPlayed,
            double des2, double des3) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.points = points;
        this.wins = wins;
        this.draws = draws;
        this.losses = losses;
        this.byes = byes;
        this.gamesPlayed = gamesPlayed;
        this.des2 = des2;
        this.des3 = des3;
    }

    public Long getPlayerId()    { return playerId; }
    public String getPlayerName(){ return playerName; }
    public double getPoints()    { return points; }
    public int getWins()         { return wins; }
    public int getDraws()        { return draws; }
    public int getLosses()       { return losses; }
    public int getByes()         { return byes; }
    public int getGamesPlayed()  { return gamesPlayed; }
    public double getDes2()      { return des2; }
    public double getDes3()      { return des3; }
}
