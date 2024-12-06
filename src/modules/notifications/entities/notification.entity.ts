import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class NotificationEntity {
  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae',
    description: 'Unique identifier of the notification user',
  })
  @Allow()
  id: string;

  @ApiProperty({
    example: 'external_id_example',
    description: 'External identifier of the user in OneSignal',
  })
  @Allow()
  externalId: string;

  @ApiProperty({
    example: '2024-02-27T12:34:56.789Z',
    description: 'Creation date of the user',
  })
  @Allow()
  createdAt: Date;

  @ApiProperty({
    example: 'active',
    description: 'Status of the user in the notification system',
  })
  @Allow()
  status: string;
}
