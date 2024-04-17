import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Game} from "../../models/game";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private httpClient: HttpClient) { }

  getGames() : Observable<Game[]> {
    return this.httpClient.get<Game[]>(environment.serverUrl + "shared/games");
  }

  createGame(homeTeamId: String, awayTeamId: String, playingTime: string) {
    return this.httpClient.post<Game>(environment.serverUrl + "game", {
      homeTeamId,
      awayTeamId,
      playingTime
    })
  }

  timeout(playingTimeLeft: number, gameId: String, teamId: String) {
    return this.httpClient.put<Game>(environment.serverUrl + "game/timeout", {
      playingTimeLeft,
      gameId,
      teamId
    })
  }

  pauseGame(playingTimeLeft: number, gameId: String) {
    return this.httpClient.put<Game>(environment.serverUrl + "game/pause", {
      playingTimeLeft,
      gameId
    })
  }

  updateTime(playingTimeLeft: number, gameId: String) {
    return this.httpClient.put<Game>(environment.serverUrl + "game/updateTime", {
      playingTimeLeft,
      gameId
    })
  }

  playGame(gameId: String) {
    return this.httpClient.put<Game>(environment.serverUrl + `game/${gameId}/playGame`, {
    })
  }

  endQuarter(gameId: String) {
    return this.httpClient.put<Game>(environment.serverUrl + `game/${gameId}/endQuarter`, {
    })
  }

  substituteInGame({gameId, teamId, playerId, newPlayerId, playedTime, quarter} : any) {
    return this.httpClient.put<Game>(environment.serverUrl + `game/substitute`, {
      gameId,
      teamId,
      oldPlayerId: playerId,
      newPlayerId,
      playedTime,
      quarter
    })
  }

  getGame(gameId: String) {
    return this.httpClient.get<Game>(environment.serverUrl + `shared/games/${gameId}`, {
    })
  }

  getReport(gameId: String) {
    return this.httpClient.get<ArrayBuffer>(environment.serverUrl + `shared/games/report/${gameId}`, {
      responseType: 'arraybuffer' as 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    })
  }
}
