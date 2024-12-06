import { ExecutionContext } from '@nestjs/common';

export function createMockExecutionContext(user: any): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        user,
      }),
    }),
    getClass: () => undefined,
    getHandler: () => undefined,
  } as unknown as ExecutionContext;
}
