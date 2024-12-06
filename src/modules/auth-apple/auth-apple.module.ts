import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '~starter/modules/auth/auth.module';
import { AuthAppleController } from '~starter/modules/auth-apple/auth-apple.controller';
import { AuthAppleService } from '~starter/modules/auth-apple/auth-apple.service';

@Module({
  controllers: [AuthAppleController],
  exports: [AuthAppleService],
  imports: [ConfigModule, AuthModule],
  providers: [AuthAppleService],
})
export class AuthAppleModule {}
