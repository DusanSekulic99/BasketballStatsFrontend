import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Team} from "../../models/team";
import {Store} from "@ngrx/store";
import {
  getAwayTeamPlayers,
  getGame,
  getHomeTeamPlayers, setGame,
  TeamType, updateClock,
  updatePlayerStats,
  updateScore
} from "../../store";
import {Game} from "../../models/game";
import {Player} from "../../models/player";
import {PlayerService} from "../../services/player/player.service";
import {GameService} from "../../services/game/game.service";
import {WebSocketService} from "../../services/web-socket.service";
import {TokenDecoderService} from "../utils/token-decoder.service";

interface UpdatePlayerStats {
  playerId: string,
  points?: number,
  isHomeTeam: boolean
}

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit, OnDestroy {

  homeTeamPlayers$: Observable<Player[]>;
  awayTeamPlayers$: Observable<Player[]>;
  game$: Observable<Game>;

  gameClockInterval: string | number | NodeJS.Timeout | undefined;

  constructor(private store: Store, private playerService: PlayerService, private gameService: GameService, private webSocketService: WebSocketService,
              public tokenDecoder: TokenDecoderService) {
    this.homeTeamPlayers$ = this.store.select(getHomeTeamPlayers);
    this.awayTeamPlayers$ = this.store.select(getAwayTeamPlayers);
    this.game$ = this.store.select(getGame);

  }

  ngOnInit(): void {
    this.game$ = this.store.select(getGame);
    let gameId: String;
    this.game$.subscribe((value) => gameId = value.gameId)
    this.webSocketService.subscribe("game", () => {
      this.gameService.getGame(gameId).subscribe((response) => {
        this.store.dispatch(setGame({game: response}));
        if (response.stopTimer) {
          this.stopCountDownLocally()
        } else {
          this.startCountdownLocally(response.playingTimeLeft)
        }
      })
    })
  }

  ngOnDestroy(): void {
    clearInterval(this.gameClockInterval);
    this.gameClockInterval = undefined;
  }


  getAllSubs(players: Player[] | null) {
    if(players)
      return players.filter((player) => !player.playing && parseInt(player.fouls) < 5);
    return [];
  }

  addPoints({points, playerId} : UpdatePlayerStats) {
    let gameId;
    this.game$.subscribe((value) => gameId = value.gameId)
    this.playerService.addPoints({playerId, points, gameId}).subscribe(
      (response) => {
        this.store.dispatch(setGame({game: response}));
      })
  }

  addRebound({playerId}: UpdatePlayerStats) {
    let gameId;
    this.game$.subscribe((value) => gameId = value.gameId)
    this.playerService.addRebound({playerId, gameId}).subscribe(
      (response) => {
        this.store.dispatch(setGame({game: response}));
      } )
  }

  addAssist({playerId}: UpdatePlayerStats) {
    let gameId;
    this.game$.subscribe((value) => gameId = value.gameId)
    this.playerService.addAssist({playerId, gameId}).subscribe(
      (response) => {
        this.store.dispatch(setGame({game: response}));
      })
  }

  addFoul({playerId}: UpdatePlayerStats) {
    let gameId;
    let playingTimeLeft: number;
    this.game$.subscribe((value) => gameId = value.gameId)
    this.game$.subscribe((value) => playingTimeLeft = value.playingTimeLeft)
    this.playerService.addFoul({playerId, gameId}).subscribe(
      (response) => {
        this.stopCountDown(playingTimeLeft, response.gameId);
      })
  }

  calculateGameTime(playingTimeLeft: number) {
    return Math.floor(playingTimeLeft/60).toFixed(0).toString().padStart(2, '0') + ":" + (playingTimeLeft % 60).toString().padStart(2, '0');
  }

  startCountdown(playingTimeLeft: number, gameId: String) {
    this.gameService.playGame(gameId).subscribe((response) => {
      this.store.dispatch(setGame({game: response}));
    })
    this.gameClockInterval = setInterval(() => {
      if (playingTimeLeft > 0) {
        playingTimeLeft--;
        this.store.dispatch(updateClock({timeLeft: playingTimeLeft}))
      } else {
        this.updateTime(playingTimeLeft, gameId)
      }
    }, 1000);
  }

  stopCountDown(playingTimeLeft: number, gameId: String) {
    clearInterval(this.gameClockInterval);
    this.gameClockInterval = undefined;
    this.gameService.pauseGame(playingTimeLeft, gameId).subscribe((response) => {
      this.store.dispatch(setGame({game: response}));
    })
  }

  callTimeout(playingTimeLeft: number, gameId: String, teamId: String) {
    clearInterval(this.gameClockInterval);
    this.gameClockInterval = undefined;
    this.gameService.timeout(playingTimeLeft, gameId, teamId).subscribe((response) => {
      this.store.dispatch(setGame({game: response}));
    })
  }

  endQuarter(gameId: String) {
    clearInterval(this.gameClockInterval);
    this.gameClockInterval = undefined;
    this.gameService.endQuarter(gameId).subscribe((response) => {
      this.store.dispatch(setGame({game: response}));
    })
  }

  private updateTime(playingTimeLeft: number, gameId: String) {
    clearInterval(this.gameClockInterval);
    this.gameService.updateTime(playingTimeLeft, gameId).subscribe((response) => {
      this.store.dispatch(setGame({game: response}));
    })
  }

  substitutePlayerInGame({playerId, newPlayerId, isHomeTeam} : any ) {
    let gameId;
    let teamId;
    let quarter;
    let playedTime;
    this.game$.subscribe((value) => {
      gameId = value.gameId
      teamId = isHomeTeam ? value.homeTeam.id : value.awayTeam.id
      quarter = value.currentQuarter
      playedTime = value.playingTime - value.playingTimeLeft
    })
    this.gameService.substituteInGame({gameId, teamId, playerId, newPlayerId, playedTime, quarter})
      .subscribe((response) => {
      this.store.dispatch(setGame({game: response}));
    })
  }

  getReport(gameId: String) {
    this.gameService.getReport(gameId).subscribe((response) => {
      const blob = new Blob([response], { type: 'application/pdf' });

      // Create a download link
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      // Set the file name
      link.download = 'your_filename.pdf';

      // Append the link to the document
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);
    })
  }

  private stopCountDownLocally() {
    clearInterval(this.gameClockInterval);
    this.gameClockInterval = undefined;
  }

  private startCountdownLocally(playingTimeLeft: number) {
    if (this.gameClockInterval == undefined) {
      this.gameClockInterval = setInterval(() => {
        if (playingTimeLeft > 0) {
          playingTimeLeft--;
          this.store.dispatch(updateClock({timeLeft: playingTimeLeft}))
        }
      }, 1000);
    }
  }

  validateGame(game: Game) {
    return game.homeTeam.players.concat(game.awayTeam.players)
      .filter(player => player.playing && parseInt(player.fouls) > 4)
      .length != 0;
  }
}
