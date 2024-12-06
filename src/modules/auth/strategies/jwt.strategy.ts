import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AllConfigType } from '~starter/config/config.type';
import { JwtPayloadType } from '~starter/modules/auth/strategies/types/jwt-payload.type';
import { RedisService } from '~starter/providers/redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService<AllConfigType>,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret', { infer: true }),
    });
  }

  public async validate(payload: JwtPayloadType): Promise<JwtPayloadType> {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    if (payload.sessionId) {
      const session = await this.redisService.get(`token:${payload.sessionId}`);

      if (!session) {
        throw new UnauthorizedException();
      }
    }

    return payload;
  }
}
