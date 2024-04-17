import { MetaReducer } from "@ngrx/store";
import { hydrationMetaReducer } from "./hydration.reducer";

export const metaReducers: MetaReducer[] = [hydrationMetaReducer];

export * from './teams/teams-store.module'
export * as reducers from './teams/state/teams.reducer'
export * from './teams/state/teams.actions'
export * from './teams/state/teams.effects'
export * from './teams/state/teams.selectors'
