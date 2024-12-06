import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

import { StatusEnum, StatusNameEnum } from '~starter/statuses/statuses.enum';

export class Status {
  @Allow()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the status.',
  })
  id: StatusEnum;

  @Allow()
  @ApiProperty({
    example: 'active',
    description: 'The name of the status.',
  })
  name?: StatusNameEnum;
}
