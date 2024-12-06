import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AllConfigType } from '~starter/config/config.type';
import { JwtRefreshPayloadType } from '~starter/modules/auth/strategies/types/jwt-refresh-payload.type';
import { RedisService } from '~starter/providers/redis/redis.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService<AllConfigType>,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.refreshSecret', { infer: true }),
    });
  }

  public async validate(
    payload: JwtRefreshPayloadType,
  ): Promise<JwtRefreshPayloadType> {
    if (!payload.sessionId) {
      throw new UnauthorizedException();
    }

    if (payload.sessionId) {
      const session = await this.redisService.get(
        `refreshToken:${payload.sessionId}`,
      );
      if (!session) {
        throw new UnauthorizedException();
      }
    }

    return payload;
  }
}
