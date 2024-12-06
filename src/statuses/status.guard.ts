import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class StatusGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const statuses = this.reflector.getAllAndOverride<number[]>('statuses', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!statuses.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    return request.user ?? statuses.includes(request.user?.status?.id);
  }
}
