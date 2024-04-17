import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {EffectsModule} from "@ngrx/effects";
import {StoreModule} from "@ngrx/store";
import {TeamsEffects} from "./state/teams.effects";
import * as fromTeams from './state/teams.reducer'

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([TeamsEffects]),
    StoreModule.forFeature(fromTeams.TEAMS_FEATURE_KEY, fromTeams.teamsReducer)
  ]
})
export class TeamsStoreModule {}
