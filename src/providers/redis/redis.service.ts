import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async set(key: string, value: string, expirationSeconds: number) {
    await this.redis.set(key, value, 'EX', expirationSeconds);
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async delete(key: string): Promise<number | null> {
    return await this.redis.del(key);
  }

  async add(key: string, id: string): Promise<number | null> {
    return await this.redis.sadd(key, id);
  }

  async deleteMany(key: string, id: string): Promise<number | null> {
    return await this.redis.srem(key, id);
  }

  async deleteAllTokens(): Promise<string> {
    return await this.redis.flushall();
  }

  async getAll(key: string): Promise<string[]> {
    return await this.redis.smembers(key);
  }
}
