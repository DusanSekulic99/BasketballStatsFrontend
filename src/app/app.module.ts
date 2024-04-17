import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {ActionReducerMap, StoreModule} from '@ngrx/store';
import { MatchesPageComponent } from './components/matches-page/matches-page.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { NavbarComponent } from './components/navbar/navbar.component';
import { TeamsComponent } from './components/teams/teams.component';
import { MatchComponent } from './components/match/match.component';
import { NewMatchComponent } from './components/new-match/new-match.component';
import {AppRoutingModule} from "./app-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import { PlayerComponent } from './components/player/player.component';
import { ViewTeamComponent } from './components/view-team/view-team.component';
import {TeamsStoreModule} from "./store";
import {EffectsModule} from "@ngrx/effects";
import { metaReducers } from './store'
import {teamsReducer} from "./store/teams/state/teams.reducer";
import {WebSocketService} from "./services/web-socket.service";
import { LoginComponent } from './components/login/login.component';
import {TokenInterceptor} from "./components/interceptors/token.interceptor";
@NgModule({
  declarations: [
    AppComponent,
    MatchesPageComponent,
    NavbarComponent,
    TeamsComponent,
    MatchComponent,
    NewMatchComponent,
    PlayerComponent,
    ViewTeamComponent,
    LoginComponent
  ],
    imports: [
        BrowserModule,
        StoreModule.forRoot(teamsReducer, {metaReducers}),
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        TeamsStoreModule,
        EffectsModule.forRoot([])
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
