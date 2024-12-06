import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { Status } from '~starter/statuses/domain/status';
export class StatusDto implements Status {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the status.',
  })
  @IsNumber()
  id: number;
}
