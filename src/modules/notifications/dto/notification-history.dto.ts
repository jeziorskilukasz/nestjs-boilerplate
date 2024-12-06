import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetNotificationHistoryDto {
  @ApiPropertyOptional({
    example: 'sent',
    description: 'Type of event to fetch (sent or clicked)',
  })
  events?: 'sent' | 'clicked';

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Email address associated with the notification history',
  })
  email?: string;

  @ApiPropertyOptional({
    example: 'app_id_example',
    description: 'App ID for which the notification history is fetched',
  })
  app_id?: string;
}
