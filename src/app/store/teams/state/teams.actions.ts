import { createAction, props } from '@ngrx/store';
import {Team} from "../../../models/team";
import {Game} from "../../../models/game";
import {PlayerGame} from "../../../models/player-game";

export const loadTeams = createAction(
  '[Teams] Load Teams'
);

export const setTeams = createAction(
  '[Teams] Set Teams',
  props<{
    readonly teams: Team[];
  }>()
)

export const addTeam = createAction(
  '[Teams] Add Team',
  props<{
    readonly team: Team;
  }>()
)

export const setTeam = createAction(
  '[Teams] Set Team by TeamType',
  props<{
    readonly team: Team;
    readonly teamType: TeamType
  }>()
)

export enum TeamType {
  HOME, AWAY, SELECTED
}

export const setGame = createAction(
  '[Game] Set Game',
  props<{
    readonly game: Game;
  }>()
)

export const updateScore = createAction(
  '[Game] Update Score',
  props<{
    readonly score: string;
  }>()
)

export const updatePlayerStats = createAction(
  '[Game] Update Team in Game by TeamType',
  props<{
    readonly team: Team;
    readonly teamType: TeamType,
    readonly otherTeam: Team,
    readonly playerId: String,
    readonly newStats: PlayerGame
  }>()
)

export const updateClock = createAction(
  '[Game] Update Clock',
  props<{
    readonly timeLeft: number;
  }>()
)
