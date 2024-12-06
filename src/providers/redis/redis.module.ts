import { Module } from '@nestjs/common';

import { RedisService } from '~starter/providers/redis/redis.service';

@Module({
  controllers: [],
  providers: [RedisService],
})
export class RedisModule {}
