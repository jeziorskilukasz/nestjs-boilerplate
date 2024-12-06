import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolesGuard } from '~starter/roles/roles.guard';
import { createMockExecutionContext } from '~starter/utils/tests/createMockExecutionContext';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should allow access when no roles are defined', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

    const context: ExecutionContext = createMockExecutionContext({
      user: { role: { id: 1 } },
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when the user role matches', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([1]);

    const context: ExecutionContext = createMockExecutionContext({
      user: { role: { id: 1 } },
    });

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should deny access when the user role does not match', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([2]);

    const context: ExecutionContext = createMockExecutionContext({
      user: { role: { id: 1 } },
    });

    expect(guard.canActivate(context)).toBe(false);
  });
});
