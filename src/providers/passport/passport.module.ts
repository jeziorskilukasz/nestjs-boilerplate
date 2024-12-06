import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtRefreshStrategy } from '~starter/modules/auth/strategies/jwt-refresh.strategy';
import { MailModule } from '~starter/providers/mail/mail.module';
import { MailerService } from '~starter/providers/mailer/mailer.service';
import { PassportService } from '~starter/providers/passport/passport.service';
import { RedisModule } from '~starter/providers/redis/redis.module';
import { RedisService } from '~starter/providers/redis/redis.service';
import { SessionModule } from '~starter/session/session.module';
import { SessionService } from '~starter/session/session.service';

@Module({
  imports: [RedisModule, SessionModule, MailModule, JwtModule.register({})],
  controllers: [],
  providers: [
    PassportService,
    MailerService,
    JwtRefreshStrategy,
    SessionService,
    RedisService,
  ],
})
export class PassportModule {}
