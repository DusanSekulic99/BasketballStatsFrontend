import { ActionReducer, INIT, UPDATE } from "@ngrx/store";
import {TeamsState} from "./teams/state/teams.reducer";

export const hydrationMetaReducer = (
  reducer: ActionReducer<TeamsState>
): ActionReducer<TeamsState> => {
  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const storageValue = localStorage.getItem("state");
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem("state");
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem("state", JSON.stringify(nextState));
    return nextState;
  };
};
