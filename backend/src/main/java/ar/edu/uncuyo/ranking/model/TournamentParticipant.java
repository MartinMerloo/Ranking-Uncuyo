package ar.edu.uncuyo.ranking.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "tournament_participants",
        uniqueConstraints = @UniqueConstraint(columnNames = {"tournament_id", "player_id"}))
public class TournamentParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    /** Rounds marked as bye (-1) in the import cross table. Each counts as 1 tournament point. */
    @Column(nullable = false)
    private int byeCount;

    // Tiebreak: Sonneborn-Berger cortado (Swiss Manager col 9)
    // Run: ALTER TABLE tournament_participants ADD COLUMN IF NOT EXISTS des2 DOUBLE PRECISION DEFAULT 0;
    @Column
    private Double des2;

    // Tiebreak: Buchholz (Swiss Manager col 10)
    // Run: ALTER TABLE tournament_participants ADD COLUMN IF NOT EXISTS des3 DOUBLE PRECISION DEFAULT 0;
    @Column
    private Double des3;

    public TournamentParticipant() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Tournament getTournament() {
        return tournament;
    }

    public void setTournament(Tournament tournament) {
        this.tournament = tournament;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public int getByeCount() {
        return byeCount;
    }

    public void setByeCount(int byeCount) {
        this.byeCount = byeCount;
    }

    public Double getDes2() {
        return des2;
    }

    public void setDes2(Double des2) {
        this.des2 = des2;
    }

    public Double getDes3() {
        return des3;
    }

    public void setDes3(Double des3) {
        this.des3 = des3;
    }
}
