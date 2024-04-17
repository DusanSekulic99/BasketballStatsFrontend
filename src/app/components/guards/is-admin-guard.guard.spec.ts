import { TestBed } from '@angular/core/testing';

import { IsAdminGuardGuard } from './is-admin-guard.guard';

describe('IsAdminGuardGuard', () => {
  let guard: IsAdminGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsAdminGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
