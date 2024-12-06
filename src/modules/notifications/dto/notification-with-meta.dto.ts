import { ApiProperty } from '@nestjs/swagger';

export class NotificationWithMeta {
  @ApiProperty({
    example: '12345',
    description: 'Notification ID',
    required: false,
  })
  id?: string;

  @ApiProperty({
    example: { en: 'Test message', fr: 'Message de test' },
    description: 'Content map in multiple languages',
    required: false,
  })
  contents?: { [language: string]: string };

  @ApiProperty({
    example: 10,
    description: 'Number of successful deliveries',
    required: false,
  })
  successful?: number;

  @ApiProperty({
    example: 5,
    description: 'Number of failed deliveries',
    required: false,
  })
  failed?: number;

  @ApiProperty({
    example: 'Test Notification',
    description: 'Name of the notification',
    required: false,
  })
  name?: string;
}
