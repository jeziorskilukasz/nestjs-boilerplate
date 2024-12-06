import { ApiProperty } from '@nestjs/swagger';

export class NotificationHistoryResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success?: boolean;

  @ApiProperty({
    example: 'https://example.com/history/csv',
    description: 'URL to the exported notification history',
  })
  destination_url?: string;
}
