import Redis from 'ioredis';

import { RedisService } from '~starter/providers/redis/redis.service';

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    sadd: jest.fn(),
    srem: jest.fn(),
    flushall: jest.fn(),
    smembers: jest.fn(),
  }));
});

describe('RedisService', () => {
  let redisService: RedisService;
  let redisMock: any;

  beforeEach(() => {
    redisMock = new Redis();
    redisService = new RedisService(redisMock);
  });

  it('redisService should be defined', () => {
    expect(redisService).toBeDefined();
  });

  it('should call set with the correct parameters', async () => {
    await redisService.set('testKey', 'testValue', 3600);
    expect(redisMock.set).toHaveBeenCalledWith(
      'testKey',
      'testValue',
      'EX',
      3600,
    );
  });

  it('should call get with the correct key', async () => {
    const testKey = 'testKey';
    redisMock.get.mockResolvedValue('testValue');

    const result = await redisService.get(testKey);
    expect(redisMock.get).toHaveBeenCalledWith(testKey);
    expect(result).toBe('testValue');
  });

  it('should call delete and return the correct value', async () => {
    const testKey = 'testKey';
    redisMock.del.mockResolvedValue(1);

    const result = await redisService.delete(testKey);
    expect(redisMock.del).toHaveBeenCalledWith(testKey);
    expect(result).toBe(1);
  });

  it('should call add with the correct parameters', async () => {
    const testKey = 'testSet';
    const testId = 'testId';
    redisMock.sadd.mockResolvedValue(1);

    const result = await redisService.add(testKey, testId);
    expect(redisMock.sadd).toHaveBeenCalledWith(testKey, testId);
    expect(result).toBe(1);
  });

  it('should call deleteMany with the correct parameters', async () => {
    const testKey = 'testSet';
    const testId = 'testId';
    redisMock.srem.mockResolvedValue(1);

    const result = await redisService.deleteMany(testKey, testId);
    expect(redisMock.srem).toHaveBeenCalledWith(testKey, testId);
    expect(result).toBe(1);
  });

  it('should call deleteAllTokens', async () => {
    redisMock.flushall.mockResolvedValue('OK');

    const result = await redisService.deleteAllTokens();
    expect(redisMock.flushall).toHaveBeenCalled();
    expect(result).toBe('OK');
  });

  it('should call getAll with the correct key and return all members', async () => {
    const testKey = 'testSet';
    const testMembers = ['member1', 'member2'];
    redisMock.smembers.mockResolvedValue(testMembers);

    const result = await redisService.getAll(testKey);
    expect(redisMock.smembers).toHaveBeenCalledWith(testKey);
    expect(result).toEqual(testMembers);
  });
});
