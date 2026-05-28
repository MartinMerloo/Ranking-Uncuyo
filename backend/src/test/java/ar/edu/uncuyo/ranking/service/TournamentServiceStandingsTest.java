package ar.edu.uncuyo.ranking.service;

import ar.edu.uncuyo.ranking.dto.TournamentStandingEntry;
import ar.edu.uncuyo.ranking.model.Match;
import ar.edu.uncuyo.ranking.model.MatchResult;
import ar.edu.uncuyo.ranking.model.Player;
import ar.edu.uncuyo.ranking.model.Tournament;
import ar.edu.uncuyo.ranking.model.TournamentParticipant;
import ar.edu.uncuyo.ranking.model.TournamentType;
import ar.edu.uncuyo.ranking.repository.MatchRepository;
import ar.edu.uncuyo.ranking.repository.TournamentParticipantRepository;
import ar.edu.uncuyo.ranking.repository.TournamentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TournamentServiceStandingsTest {

    @Mock
    private TournamentRepository tournamentRepository;
    @Mock
    private MatchRepository matchRepository;
    @Mock
    private TournamentParticipantRepository participantRepository;

    private TournamentService tournamentService;

    private Tournament tournament;
    private Player alice;
    private Player bob;
    private Player carol;

    @BeforeEach
    void setUp() {
        tournamentService = new TournamentService(tournamentRepository, matchRepository, participantRepository);

        tournament = new Tournament();
        tournament.setId(11L);
        tournament.setName("Test Open");
        tournament.setDate(LocalDate.of(2025, 5, 1));
        tournament.setType(TournamentType.RAPID);
        tournament.setRounds(5);

        alice = player(1L, "Alice");
        bob = player(2L, "Bob");
        carol = player(3L, "Carol");

        when(tournamentRepository.findById(11L)).thenReturn(Optional.of(tournament));
    }

    @Test
    void includesByeOnlyPlayerFromRegisteredRoster() {
        when(participantRepository.findByTournamentId(11L)).thenReturn(List.of(
                participant(alice, 0),
                participant(bob, 0),
                participant(carol, 5)));
        when(matchRepository.findByTournamentIdOrderByRoundAscIdAsc(11L)).thenReturn(List.of(
                match(1, 1, alice, bob, MatchResult.WHITE_WIN)));

        List<TournamentStandingEntry> standings = tournamentService.getStandings(11L);

        assertThat(standings).hasSize(3);
        TournamentStandingEntry byeOnly = standings.stream()
                .filter(s -> s.getPlayerId().equals(3L))
                .findFirst()
                .orElseThrow();
        assertThat(byeOnly.getPoints()).isEqualTo(5.0);
        assertThat(byeOnly.getWins()).isEqualTo(5);
        assertThat(byeOnly.getByes()).isZero();
        assertThat(byeOnly.getGamesPlayed()).isEqualTo(5);
    }

    @Test
    void doesNotTreatForfeitRoundsAsByeWhenRosterStoresExplicitByeCount() {
        when(participantRepository.findByTournamentId(11L)).thenReturn(List.of(
                participant(alice, 1),
                participant(bob, 0)));
        when(matchRepository.findByTournamentIdOrderByRoundAscIdAsc(11L)).thenReturn(List.of(
                match(1, 1, alice, bob, MatchResult.WHITE_WIN),
                match(2, 2, alice, bob, MatchResult.BLACK_WIN),
                match(3, 3, alice, bob, MatchResult.DRAW)));

        List<TournamentStandingEntry> standings = tournamentService.getStandings(11L);

        TournamentStandingEntry aliceStanding = standings.stream()
                .filter(s -> s.getPlayerId().equals(1L))
                .findFirst()
                .orElseThrow();
        assertThat(aliceStanding.getByes()).isZero();
        assertThat(aliceStanding.getPoints()).isEqualTo(2.5);
        assertThat(aliceStanding.getWins()).isEqualTo(2);   // 1 match win + 1 BYE win
        assertThat(aliceStanding.getDraws()).isEqualTo(1);
        assertThat(aliceStanding.getLosses()).isEqualTo(1);
        assertThat(aliceStanding.getGamesPlayed()).isEqualTo(4); // 3 match rounds + 1 BYE round
    }

    @Test
    void sortsByPointsThenWins() {
        when(participantRepository.findByTournamentId(11L)).thenReturn(List.of(
                participant(alice, 0),
                participant(bob, 0),
                participant(carol, 0)));
        when(matchRepository.findByTournamentIdOrderByRoundAscIdAsc(11L)).thenReturn(List.of(
                match(1, 1, alice, bob, MatchResult.DRAW),
                match(2, 1, carol, alice, MatchResult.WHITE_WIN)));

        List<TournamentStandingEntry> standings = tournamentService.getStandings(11L);

        assertThat(standings.get(0).getPlayerId()).isEqualTo(3L);   // carol: 1 win → 1.0 pts
        assertThat(standings.get(0).getPoints()).isEqualTo(1.0);
        assertThat(standings.get(1).getPlayerId()).isEqualTo(1L);   // alice: 0.5 pts, alphabetical tiebreak over bob
        assertThat(standings.get(2).getPlayerId()).isEqualTo(2L);
    }

    @Test
    void registerImportedParticipantsMakesRosterAvailableOnNextStandingsCall() {
        when(tournamentRepository.findById(11L)).thenReturn(Optional.of(tournament));
        tournamentService.registerImportedParticipants(11L, Map.of(carol, new TournamentService.ParticipantData(4, 0.0, 0.0)));

        when(participantRepository.findByTournamentId(11L)).thenReturn(List.of(participant(carol, 4)));
        when(matchRepository.findByTournamentIdOrderByRoundAscIdAsc(11L)).thenReturn(List.of());

        List<TournamentStandingEntry> standings = tournamentService.getStandings(11L);

        assertThat(standings).hasSize(1);
        assertThat(standings.get(0).getPlayerName()).isEqualTo("Carol");
        assertThat(standings.get(0).getPoints()).isEqualTo(4.0);
    }

    private static Player player(Long id, String name) {
        Player player = new Player();
        player.setId(id);
        player.setFullName(name);
        return player;
    }

    private static TournamentParticipant participant(Player player, int byeCount) {
        TournamentParticipant participant = new TournamentParticipant();
        participant.setTournament(new Tournament());
        participant.setPlayer(player);
        participant.setByeCount(byeCount);
        return participant;
    }

    private static Match match(int round, long id, Player white, Player black, MatchResult result) {
        Match match = new Match();
        match.setId(id);
        match.setRound(round);
        match.setTournament(new Tournament());
        match.setWhitePlayer(white);
        match.setBlackPlayer(black);
        match.setResult(result);
        match.setDate(LocalDate.of(2025, 5, 1));
        return match;
    }
}
