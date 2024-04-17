import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Player} from "../../models/player";
import {PlayerGame} from "../../models/player-game";
import {Game} from "../../models/game";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private httpClient: HttpClient) { }

  public getPlayersFromTeam(teamId: String | undefined) {
    return this.httpClient.get<Player[]>(environment.serverUrl + `shared/player-team/${teamId}/players`);
  }

  public createPlayer(player: Player, teamId: String | undefined) {
    return this.httpClient.post<Player>(environment.serverUrl + 'player', {
      firstName: player.firstName,
      lastName: player.lastName,
      jerseyNo: player.jerseyNo,
      position: player.position,
      starter: player.starter,
      teamId: teamId
    })
  }

  removePlayer(playerId: string) {
    return this.httpClient.delete<Player[]>(environment.serverUrl + `player/${playerId}`);
  }

  substitutePlayer(starterId: any, newStarterId: any) {
    return this.httpClient.put<Player[]>(environment.serverUrl + `player-team/substitute`, {
      starterId,
      newStarterId
    })
  }

  addPoints({playerId, points, gameId} : any) {
    return this.httpClient.put<Game>(environment.serverUrl + `player-game/${gameId}/${playerId}/points/${points}`, {});
  }

  addRebound({playerId, gameId} : any) {
    return this.httpClient.put<Game>(environment.serverUrl + `player-game/${gameId}/${playerId}/rebound`, {});
  }

  addAssist({playerId, gameId} : any) {
    return this.httpClient.put<Game>(environment.serverUrl + `player-game/${gameId}/${playerId}/assist`, {});
  }

  addFoul({playerId, gameId} : any) {
    return this.httpClient.put<Game>(environment.serverUrl + `player-game/${gameId}/${playerId}/foul`, {});
  }
}
