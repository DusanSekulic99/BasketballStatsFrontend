import {Team} from "./team";

export interface Game {
  gameId: String;
  currentQuarter: String;
  playingTime: number;
  playingTimeLeft: number;
  homeTeam: Team;
  awayTeam: Team;
  currentScore: String;
  homeTeamBonus: number;
  awayTeamBonus: number;
  homeTeamTimeout: number;
  awayTeamTimeout: number;
  status: String;
  stopTimer: boolean;
}
