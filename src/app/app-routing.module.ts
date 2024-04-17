import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import {MatchesPageComponent} from "./components/matches-page/matches-page.component";
import {TeamsComponent} from "./components/teams/teams.component";
import {PlayerComponent} from "./components/player/player.component";
import {MatchComponent} from "./components/match/match.component";
import {NewMatchComponent} from "./components/new-match/new-match.component";
import {ViewTeamComponent} from "./components/view-team/view-team.component";
import {LoginComponent} from "./components/login/login.component";
import {IsAdminGuardGuard} from "./components/guards/is-admin-guard.guard";

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: MatchesPageComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'team/:teamId', component: ViewTeamComponent },
  { path: 'player/:playerId', component: PlayerComponent },
  { path: 'match/:matchId', component: MatchComponent },
  { path: 'new-match', component: NewMatchComponent, canActivate: [IsAdminGuardGuard] },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}

