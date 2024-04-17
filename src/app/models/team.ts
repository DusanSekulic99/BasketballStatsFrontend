import {Player} from "./player";

export interface Team {
  id: String;
  name: String;
  badge: String;
  players: Player[];
}
