import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ConsentModule } from '~starter/consent/consent.module';
import { ConsentService } from '~starter/consent/consent.service';
import { AuthController } from '~starter/modules/auth/auth.controller';
import { AuthService } from '~starter/modules/auth/auth.service';
import { JwtRefreshStrategy } from '~starter/modules/auth/strategies/jwt-refresh.strategy';
import { JwtStrategy } from '~starter/modules/auth/strategies/jwt.strategy';
import { FilesModule } from '~starter/modules/files/files.module';
import { FilesService } from '~starter/modules/files/files.service';
import { UsersModule } from '~starter/modules/users/users.module';
import { UsersService } from '~starter/modules/users/users.service';
import { MailModule } from '~starter/providers/mail/mail.module';
import { MailerService } from '~starter/providers/mailer/mailer.service';
import { PassportModule } from '~starter/providers/passport/passport.module';
import { PassportService } from '~starter/providers/passport/passport.service';
import { PrismaModule } from '~starter/providers/prisma/prisma.module';
import { RedisModule } from '~starter/providers/redis/redis.module';
import { RedisService } from '~starter/providers/redis/redis.service';
import { SessionModule } from '~starter/session/session.module';
import { SessionService } from '~starter/session/session.service';

@Module({
  imports: [
    RedisModule,
    PrismaModule,
    PassportModule,
    UsersModule,
    AuthModule,
    MailModule,
    FilesModule,
    ConsentModule,
    SessionModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailerService,
    ConsentService,
    JwtStrategy,
    UsersService,
    FilesService,
    RedisService,
    SessionService,
    PassportService,
    JwtRefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
