import {Component, OnInit} from '@angular/core';
import {GameService} from "../../services/game/game.service";
import {Game} from "../../models/game";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {setGame, setTeam, TeamType} from "../../store";

@Component({
  selector: 'app-matches-page',
  templateUrl: './matches-page.component.html',
  styleUrls: ['./matches-page.component.scss']
})
export class MatchesPageComponent implements OnInit {

  public games: Game[];

  constructor(private gameService: GameService, private router: Router, private store: Store) {
    this.games = [];
  }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(response => this.games = response);
  }

  watchMatch(match: string, gameId: String) {
    const game = this.games.filter(game => game.gameId === gameId)[0];
    this.store.dispatch(setGame({game}))
    this.store.dispatch(setTeam({team: game.homeTeam, teamType: TeamType.HOME}))
    this.store.dispatch(setTeam({team: game.awayTeam, teamType: TeamType.AWAY}))
    this.router.navigate([match + '/' + gameId])
  }
}
