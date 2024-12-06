import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '~starter/modules/auth/auth.module';
import { AuthGoogleController } from '~starter/modules/auth-google/auth-google.controller';
import { AuthGoogleService } from '~starter/modules/auth-google/auth-google.service';

@Module({
  controllers: [AuthGoogleController],
  exports: [AuthGoogleService],
  imports: [ConfigModule, AuthModule],
  providers: [AuthGoogleService],
})
export class AuthGoogleModule {}
