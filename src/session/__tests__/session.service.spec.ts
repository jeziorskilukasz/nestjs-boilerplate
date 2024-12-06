import { Test, TestingModule } from '@nestjs/testing';

import { HashTypes } from '~starter/modules/auth/strategies/types/hash-type';
import { RedisService } from '~starter/providers/redis/redis.service';
import { SessionService } from '~starter/session/session.service';

jest.mock('~starter/providers/redis/redis.service', () => ({
  RedisService: jest.fn().mockImplementation(() => ({
    set: jest.fn().mockResolvedValue('OK') as jest.MockedFunction<
      (
        key: string,
        value: string,
        mode: 'EX',
        expirationSeconds: number,
      ) => Promise<'OK'>
    >,
    get: jest.fn().mockResolvedValue('mockValue') as jest.MockedFunction<
      (key: string) => Promise<string | null>
    >,
    delete: jest.fn().mockResolvedValue(1) as jest.MockedFunction<
      (key: string) => Promise<number>
    >,
    add: jest.fn().mockResolvedValue(1) as jest.MockedFunction<
      (key: string, id: string) => Promise<number>
    >,
    deleteMany: jest.fn().mockResolvedValue(1) as jest.MockedFunction<
      (key: string, id: string) => Promise<number>
    >,
    deleteAllTokens: jest.fn().mockResolvedValue('OK') as jest.MockedFunction<
      () => Promise<string>
    >,
    getAll: jest
      .fn()
      .mockResolvedValue(['session1', 'session2']) as jest.MockedFunction<
      (key: string) => Promise<string[]>
    >,
  })),
}));

describe('SessionService', () => {
  let service: SessionService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionService, RedisService],
    }).compile();

    service = module.get<SessionService>(SessionService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should create a session correctly', async () => {
    const mockSessionData = {
      refreshToken: 'mockRefreshToken',
      sessionId: 'mockSessionId',
      token: 'mockAccessToken',
      ttlRefreshToken: 3600,
      ttlToken: 1800,
      userId: 'mockUserId',
    };

    const sessionId = await service.createSession(mockSessionData);

    expect(sessionId).toEqual(mockSessionData.sessionId);
    expect(redisService.add).toHaveBeenCalledWith(
      `userSessions:${mockSessionData.userId}`,
      mockSessionData.sessionId,
    );
    expect(redisService.set).toHaveBeenCalledWith(
      `refreshToken:${mockSessionData.sessionId}`,
      mockSessionData.refreshToken,
      mockSessionData.ttlRefreshToken,
    );
    expect(redisService.set).toHaveBeenCalledWith(
      `token:${mockSessionData.sessionId}`,
      mockSessionData.token,
      mockSessionData.ttlToken,
    );
  });

  it('should logout from a session correctly', async () => {
    const userId = 'mockUserId';
    const sessionId = 'mockSessionId';

    await service.logoutSession(userId, sessionId);

    expect(redisService.deleteMany).toHaveBeenCalledWith(
      `userSessions:${userId}`,
      sessionId,
    );
    expect(redisService.delete).toHaveBeenCalledWith(
      `refreshToken:${sessionId}`,
    );
    expect(redisService.delete).toHaveBeenCalledWith(`token:${sessionId}`);
  });

  it('should create a hash session correctly', async () => {
    const hashSessionData = {
      userId: 'mockUserId',
      type: 'confirmEmail' as HashTypes,
      hash: 'mockHash',
      expiresIn: 3600,
    };

    await service.createHashSession(hashSessionData);

    expect(redisService.set).toHaveBeenCalledWith(
      `${hashSessionData.type}Code:${hashSessionData.userId}`,
      hashSessionData.hash,
      hashSessionData.expiresIn,
    );
  });

  it('should retrieve a hash session correctly for confirmEmail', async () => {
    const hashSessionData = {
      userId: 'mockUserId',
      type: 'confirmEmail' as HashTypes,
    };

    const result = await service.checkHashSession(hashSessionData);

    expect(redisService.get).toHaveBeenCalledWith(
      `${hashSessionData.type}Code:${hashSessionData.userId}`,
    );
    expect(result).toEqual('mockValue');
  });

  it('should logout other sessions except the current one correctly', async () => {
    const userId = 'mockUserId';
    const currentSessionId = 'currentSessionId';
    redisService.getAll(currentSessionId);

    await service.logoutOtherSessions(userId, currentSessionId);

    expect(redisService.deleteMany).not.toHaveBeenCalledWith(
      `userSessions:${userId}`,
      'currentSessionId',
    );
  });
});
