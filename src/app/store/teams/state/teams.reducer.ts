import { Action, createReducer, on } from '@ngrx/store';
import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {Team} from "../../../models/team";
import {
  addTeam,
  setGame,
  setTeam,
  setTeams,
  TeamType,
  updateClock,
  updatePlayerStats,
  updateScore
} from "./teams.actions";
import {Game} from "../../../models/game";
import {PlayerGame} from "../../../models/player-game";
import {getGame} from "./teams.selectors";


export const TEAMS_FEATURE_KEY = 'teams';

export interface TeamsState extends EntityState<Team> {
  readonly selectedTeam: Team;
  readonly homeTeam: Team;
  readonly awayTeam: Team;
  readonly game: Game;
}

export const adapter = createEntityAdapter<Team>({});

export const initialState = adapter.getInitialState({
  selectedTeam: {},
  homeTeam: {},
  awayTeam: {},
  game: {
    playingTimeLeft: 0
  },
  id: 0
});


export const teamsReducer = createReducer(
  initialState,

  on(setTeams, (state, action) =>
    adapter.setAll(action.teams, {...state})
  ),

  on(setTeams, (state, action) =>
    adapter.setAll(action.teams, {...state})
  ),

  on(addTeam, (state, action) =>
    adapter.addOne(action.team, state)
  ),

  on(setTeam, (state, action) => ({
      ...state,
      homeTeam: action.teamType === TeamType.HOME ? action.team : state.homeTeam,
      awayTeam: action.teamType === TeamType.AWAY ? action.team : state.awayTeam,
      selectedTeam: action.teamType === TeamType.SELECTED ? action.team : state.selectedTeam
    })
  ),

  on(setGame, (state, action) => ({
      ...state,
      game: {
        ...state.game,
        gameId: action.game.gameId,
        awayTeam: action.game.awayTeam,
        homeTeam: action.game.homeTeam,
        currentScore: action.game.currentScore,
        currentQuarter: action.game.currentQuarter,
        playingTimeLeft: action.game.status === 'PLAYING' ? state.game.playingTimeLeft : action.game.playingTimeLeft,
        homeTeamBonus: action.game.homeTeamBonus,
        awayTeamBonus: action.game.awayTeamBonus,
        homeTeamTimeout: action.game.homeTeamTimeout,
        awayTeamTimeout: action.game.awayTeamTimeout,
        status: action.game.status,
        stopTimer: action.game.stopTimer,
        playingTime: action.game.playingTime

      }
    })
  ),

  on(updateScore, (state, action) => ({
      ...state,
      game: {
        ...state.game,
        currentScore: action.score
      }
    })
  ),

  on(updatePlayerStats, (state, action) => ({
    ...state,
    game: {
      ...state.game,
      homeTeam: action.teamType === TeamType.HOME ? updatePlayer(action.team, action.playerId, action.newStats) : action.otherTeam,
      awayTeam: action.teamType === TeamType.AWAY ? updatePlayer(action.team, action.playerId, action.newStats) : action.otherTeam
    }
  })),

  on(updateClock, (state, action) => ({
    ...state,
    game: {
      ...state.game,
      playingTimeLeft: action.timeLeft
    }
  }))

);

function updatePlayer(team: Team, playerId: String, response: PlayerGame): Team {
  const playerIndex = team.players.findIndex(player => player.id === playerId);
  return ({
    ...team,
    players: [
      ...team.players.slice(0, playerIndex),
      {
      ...team.players[playerIndex],
        points: response.points,
        assists: response.assists,
        rebounds: response.rebounds,
        fouls: response.fouls,
      },
      ...team.players.slice(playerIndex + 1)
    ]
  });
}
