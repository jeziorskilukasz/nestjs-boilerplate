import { Module } from '@nestjs/common';

import { RedisModule } from '~starter/providers/redis/redis.module';
import { RedisService } from '~starter/providers/redis/redis.service';
import { SessionService } from '~starter/session/session.service';

@Module({
  controllers: [],
  imports: [RedisModule],
  providers: [RedisService, SessionService],
})
export class SessionModule {}
