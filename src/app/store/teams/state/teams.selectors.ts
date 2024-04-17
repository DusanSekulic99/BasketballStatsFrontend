import { createFeatureSelector, createSelector } from '@ngrx/store';
import {adapter, TEAMS_FEATURE_KEY, TeamsState} from "./teams.reducer";

const { selectAll } = adapter.getSelectors();

export const teamsState =
  createFeatureSelector<TeamsState>(TEAMS_FEATURE_KEY);

export const allTeams = createSelector(teamsState, selectAll);

export const getSelectedTeam = createSelector(teamsState,
  (state) => state.selectedTeam )

export const getHomeTeam = createSelector(teamsState,
  (state) => state.homeTeam )

export const getHomeTeamPlayers = createSelector(teamsState,
  (state) => state.game.homeTeam.players )

export const getAwayTeam = createSelector(teamsState,
  (state) => state.awayTeam )

export const getAwayTeamPlayers = createSelector(teamsState,
  (state) => state.game.awayTeam.players )

export const getGame = createSelector(teamsState,
  (state) => state.game )

