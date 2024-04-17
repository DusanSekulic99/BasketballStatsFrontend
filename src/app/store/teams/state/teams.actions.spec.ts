import * as fromTeams from './teams.actions';

describe('loadTeams', () => {
  it('should return an action', () => {
    expect(fromTeams.loadTeams().type).toBe('[Teams] Load Teamss');
  });
});
