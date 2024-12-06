import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '~starter/modules/auth/auth.module';
import { AuthFacebookController } from '~starter/modules/auth-facebook/auth-facebook.controller';
import { AuthFacebookService } from '~starter/modules/auth-facebook/auth-facebook.service';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [AuthFacebookController],
  exports: [AuthFacebookService],
  providers: [AuthFacebookService],
})
export class AuthFacebookModule {}
