import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport, RedisOptions } from '@nestjs/microservices';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
  HttpHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';

import { HealthEntity } from '~starter/modules/health/entity/health.entity';
import { PrismaService } from '~starter/providers/prisma/prisma.service';
import { ErrorEntity } from '~starter/shared/errors/error-entity';

@Controller({
  path: 'health',
  version: '1',
})
@ApiTags('health')
export class HealthController {
  constructor(
    private configService: ConfigService,
    private db: PrismaService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
  ) {}
  @ApiResponse({
    status: 200,
    description: 'The health check result.',
    type: HealthEntity,
  })
  @ApiResponse({ status: 503, description: 'One or more health checks failed' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorEntity,
  })
  @Get()
  @ApiOperation({
    summary: 'Check Health',
    description:
      'Performs a health check, verifying the database, frontend domain, and cache connectivity.',
  })
  @HealthCheck()
  check() {
    const appDomain = this.configService.getOrThrow('app.frontendDomain', {
      infer: true,
    });

    const host = this.configService.getOrThrow('redis.host', {
      infer: true,
    });

    const port = this.configService.getOrThrow('redis.port', {
      infer: true,
    });

    const username = this.configService.getOrThrow('redis.username', {
      infer: true,
    });

    const password = this.configService.getOrThrow('redis.password', {
      infer: true,
    });

    return this.health.check([
      async () => this.prismaHealth.pingCheck('db', this.db),
      async () => this.http.pingCheck('domain', appDomain),
      async () =>
        this.microservice.pingCheck<RedisOptions>('cache', {
          transport: Transport.REDIS,
          options: {
            host,
            port,
            username,
            password,
          },
        }),
    ]);
  }
}
