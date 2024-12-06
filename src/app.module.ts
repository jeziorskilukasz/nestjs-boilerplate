import path from 'path';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule as Redis } from '@nestjs-modules/ioredis';
import * as redisStore from 'cache-manager-redis-store';
import { I18nModule, AcceptLanguageResolver } from 'nestjs-i18n';

import appConfig from '~starter/config/app.config';
import { AllConfigType } from '~starter/config/config.type';
import { ConsentModule } from '~starter/consent/consent.module';
import { ArticlesModule } from '~starter/modules/articles/articles.module';
import { AuthModule } from '~starter/modules/auth/auth.module';
import authConfig from '~starter/modules/auth/config/auth.config';
import { AuthAppleModule } from '~starter/modules/auth-apple/auth-apple.module';
import appleConfig from '~starter/modules/auth-apple/config/apple.config';
import { AuthFacebookModule } from '~starter/modules/auth-facebook/auth-facebook.module';
import facebookConfig from '~starter/modules/auth-facebook/config/facebook.config';
import { AuthGoogleModule } from '~starter/modules/auth-google/auth-google.module';
import googleConfig from '~starter/modules/auth-google/config/google.config';
import fileConfig from '~starter/modules/files/config/file.config';
import { FilesModule } from '~starter/modules/files/files.module';
import { HealthModule } from '~starter/modules/health/health.module';
import notificationConfig from '~starter/modules/notifications/config/notification-config';
import { NotificationsModule } from '~starter/modules/notifications/notifications.module';
import systemConfig from '~starter/modules/system/config/system.config';
import { SystemModule } from '~starter/modules/system/system.module';
import { UsersModule } from '~starter/modules/users/users.module';
import mailConfig from '~starter/providers/mail/config/mail.config';
import { PassportModule } from '~starter/providers/passport/passport.module';
import redisConfig from '~starter/providers/redis/config/redis.config';
import { RedisModule } from '~starter/providers/redis/redis.module';
import { SessionModule } from '~starter/session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        authConfig,
        googleConfig,
        systemConfig,
        facebookConfig,
        fileConfig,
        notificationConfig,
        appleConfig,
        mailConfig,
        redisConfig,
      ],
      envFilePath: ['.env'],
    }),
    Redis.forRoot({
      type: 'single',
      url: `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      options: {
        username: `${process.env.REDIS_USER}`,
        password: `${process.env.REDIS_PASSWORD}`,
        enableReadyCheck: false,
      },
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      username: process.env.REDIS_USER,
      password: process.env.REDIS_PASSWORD,
      no_ready_check: true, // ReplyError: Ready check failed: NOAUTH Authentication required
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [AcceptLanguageResolver],
      imports: [],
      inject: [ConfigService],
    }),
    ArticlesModule,
    AuthAppleModule,
    AuthFacebookModule,
    AuthGoogleModule,
    AuthModule,
    ConsentModule,
    FilesModule,
    HealthModule,
    NotificationsModule,
    PassportModule,
    RedisModule,
    SessionModule,
    SystemModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
