import { Injectable } from '@nestjs/common';

import { AuthEntity } from '~starter/modules/auth/entity/auth.entity';
import { HashTypes } from '~starter/modules/auth/strategies/types/hash-type';
import { JwtPayloadType } from '~starter/modules/auth/strategies/types/jwt-payload.type';
import { UserEntity } from '~starter/modules/users/entities/user.entity';
import { RedisService } from '~starter/providers/redis/redis.service';

@Injectable()
export class SessionService {
  constructor(private readonly redisService: RedisService) {}
  async getRefreshSession(currentSessionId: JwtPayloadType['sessionId']) {
    return await this.redisService.get(`refreshToken:${currentSessionId}`);
  }
  async createSession({
    refreshToken,
    sessionId,
    token,
    ttlRefreshToken,
    ttlToken,
    userId,
  }: {
    refreshToken: AuthEntity['refreshToken'];
    sessionId: JwtPayloadType['sessionId'];
    token: AuthEntity['accessToken'];
    ttlRefreshToken: AuthEntity['tokenExpires'];
    ttlToken: AuthEntity['tokenExpires'];
    userId: UserEntity['id'];
  }): Promise<string> {
    await this.redisService.add(`userSessions:${userId}`, sessionId);
    await this.redisService.set(
      `refreshToken:${sessionId}`,
      refreshToken,
      ttlRefreshToken,
    );
    await this.redisService.set(`token:${sessionId}`, token, ttlToken);
    return sessionId;
  }

  async logoutSession(
    userId: UserEntity['id'],
    sessionId: JwtPayloadType['sessionId'],
  ) {
    await this.redisService.deleteMany(`userSessions:${userId}`, sessionId);
    await this.redisService.delete(`refreshToken:${sessionId}`);
    await this.redisService.delete(`token:${sessionId}`);
  }

  async logoutAllSessions(userId: UserEntity['id']) {
    const sessionIds = await this.redisService.getAll(`userSessions:${userId}`);
    for (const sessionId of sessionIds) {
      await this.logoutSession(userId, sessionId);
    }

    await this.redisService.delete(`userSessions:${userId}`);
  }

  async logoutOtherSessions(
    userId: UserEntity['id'],
    currentSessionId: JwtPayloadType['sessionId'],
  ) {
    const sessionIds = await this.redisService.getAll(`userSessions:${userId}`);
    for (const sessionId of sessionIds) {
      if (sessionId !== currentSessionId) {
        await this.logoutSession(userId, sessionId);
      }
    }
  }

  async createHashSession({
    userId,
    type,
    hash,
    expiresIn,
  }: {
    type: HashTypes;
    userId: UserEntity['id'];
    hash: string;
    expiresIn: number;
  }): Promise<void> {
    return await this.redisService.set(
      `${type}Code:${userId}`,
      hash,
      expiresIn,
    );
  }

  async checkHashSession({
    userId,
    type,
  }: {
    type: HashTypes;
    userId: UserEntity['id'];
  }): Promise<string> {
    return await this.redisService.get(`${type}Code:${userId}`);
  }

  async removeHashSession({
    userId,
    type,
  }: {
    type: HashTypes;
    userId: UserEntity['id'];
  }): Promise<number> {
    return await this.redisService.delete(`${type}Code:${userId}`);
  }
}
