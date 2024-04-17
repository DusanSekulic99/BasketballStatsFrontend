import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Team} from "../../models/team";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private httpClient: HttpClient) { }

  public getTeams() {
    return this.httpClient.get<Team[]>(environment.serverUrl + 'shared/team')
  }

  createTeam(teamName: any, teamBadge: any) {
    return this.httpClient.post<Team>(environment.serverUrl + 'team', {
        name: teamName,
        badge: teamBadge
    })
  }

  removeTeam(teamId: String) {
    return this.httpClient.delete<Team>(environment.serverUrl + `team/${teamId}`)
  }
}
