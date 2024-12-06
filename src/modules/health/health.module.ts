import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from '~starter/modules/health/health.controller';
import { HealthService } from '~starter/modules/health/health.service';
import { PrismaModule } from '~starter/providers/prisma/prisma.module';

@Module({
  imports: [TerminusModule, PrismaModule, ConfigModule, HttpModule],
  controllers: [HealthController],
  providers: [HealthService, ConfigService],
})
export class HealthModule {}
