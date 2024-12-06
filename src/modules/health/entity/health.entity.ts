import { ApiProperty } from '@nestjs/swagger';

class HealthCheckStatusDto {
  @ApiProperty({
    description: 'The status of the component',
    example: 'up',
  })
  status: string;
}

class HealthCheckInfoDto {
  @ApiProperty({
    type: HealthCheckStatusDto,
    description: 'The status of the database connection',
  })
  db: HealthCheckStatusDto;

  @ApiProperty({
    type: HealthCheckStatusDto,
    description: 'The status of the domain',
  })
  domain: HealthCheckStatusDto;

  @ApiProperty({
    type: HealthCheckStatusDto,
    description: 'The status of the cache',
  })
  cache: HealthCheckStatusDto;
}

export class HealthEntity {
  @ApiProperty({
    description: 'Overall health status',
    example: 'ok',
  })
  status: string;

  @ApiProperty({
    type: HealthCheckInfoDto,
    description: "Detailed info about each component's health",
  })
  info: HealthCheckInfoDto;

  @ApiProperty({
    description: 'Details of any errors encountered during the health check',
    example: {},
  })
  error: Record<string, any>;

  @ApiProperty({
    type: HealthCheckInfoDto,
    description: 'Detailed health check results for each component',
  })
  details: HealthCheckInfoDto;
}
