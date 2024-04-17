import {Component, OnInit} from '@angular/core';
import {TeamsService} from "../../services/teams/teams.service";
import {PlayerService} from "../../services/player/player.service";
import {Router} from "@angular/router";
import {GameService} from "../../services/game/game.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Team} from "../../models/team";
import {Player} from "../../models/player";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {setGame, setTeam, TeamType} from "../../store";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.scss']
})
export class NewMatchComponent implements OnInit {

  private teamsSubject = new BehaviorSubject<Team[]>([]);
  public selectedHomeTeamSubject = new BehaviorSubject<Team>({id: "", name: "", badge: "", players: []});
  public selectedAwayTeamSubject = new BehaviorSubject<Team>({id: "", name: "", badge: "", players: []});

  private homePlayersSubject = new BehaviorSubject<Player[]>([]);
  private awayPlayersSubject = new BehaviorSubject<Player[]>([]);

  public teams$: Observable<Team[]>;
  public homePlayers$: Observable<Player[]>;
  public awayPlayers$: Observable<Player[]>;

  public homeSubs: Player[] = [];
  public awaySubs: Player[] = [];

  public newGameForm: FormGroup;


  constructor(private teamService: TeamsService, private playerService: PlayerService,
              private gameService: GameService, private router: Router, formBuilder: FormBuilder, private store: Store) {
    this.teams$ = this.teamsSubject.asObservable();
    this.homePlayers$ = this.homePlayersSubject.asObservable();
    this.awayPlayers$ = this.awayPlayersSubject.asObservable();
    this.newGameForm = formBuilder.group({
      minutes: ['10', Validators.required]
    })
  }

  ngOnInit(): void {
    this.teamService.getTeams().subscribe((teams) => {
      this.teamsSubject.next(teams)
      this.selectHomeTeam(teams[0])
      this.selectAwayTeam(teams[1])
    });
  }

  selectHomeTeam(team: Team) {
    this.selectedHomeTeamSubject.next(team);
    this.homePlayersSubject.next(team.players.filter(player => player.starter)
      .sort((a, b) => a.starter ? 1 : -1))
    this.homeSubs =  team.players.filter((player => !player.starter));
  }

  selectAwayTeam(team: Team) {
    this.selectedAwayTeamSubject.next(team);
    this.awayPlayersSubject.next(team.players.filter(player => player.starter)
      .sort((a, b) => a.starter ? 1 : -1))
    this.awaySubs =  team.players.filter((player => !player.starter));
  }

  substituteHomePlayer({playerId, newPlayerId}: any) {
    return this.playerService.substitutePlayer(playerId, newPlayerId).subscribe((players) => {
      this.homePlayersSubject.next(players.filter(player => player.starter)
        .sort((a, b) => a.starter ? 1 : -1))
      this.homeSubs = players.filter((player => !player.starter));
    })
  }

    substituteAwayPlayer({playerId, newPlayerId}: any) {
      return this.playerService.substitutePlayer(playerId, newPlayerId).subscribe((players) => {
        this.awayPlayersSubject.next(players.filter(player => player.starter)
          .sort((a, b) => a.starter ? 1 : -1))
        this.awaySubs =  players.filter((player => !player.starter));
      })
  }

  createAndStartGame() {
    const homeTeam = this.selectedHomeTeamSubject.getValue();
    const awayTeam = this.selectedAwayTeamSubject.getValue();
    this.gameService.createGame(homeTeam.id, awayTeam.id, this.newGameForm.get('minutes')?.value).subscribe((newGame) => {
      this.store.dispatch(setGame({game: newGame}))
      this.router.navigate([`match/${newGame.gameId}`])
    })
  }
}
