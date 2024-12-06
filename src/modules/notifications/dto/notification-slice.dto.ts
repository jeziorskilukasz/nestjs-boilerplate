import { ApiProperty } from '@nestjs/swagger';

import { NotificationWithMeta } from './notification-with-meta.dto';

export class NotificationSlice {
  @ApiProperty({
    example: 50,
    description: 'Total number of notifications',
    required: false,
  })
  total_count?: number;

  @ApiProperty({
    example: 0,
    description: 'Pagination offset',
    required: false,
  })
  offset?: number;

  @ApiProperty({
    example: 10,
    description: 'Limit of notifications per page',
    required: false,
  })
  limit?: number;

  @ApiProperty({
    type: [NotificationWithMeta],
    description: 'Array of notifications',
    required: false,
  })
  notifications?: NotificationWithMeta[];
}
