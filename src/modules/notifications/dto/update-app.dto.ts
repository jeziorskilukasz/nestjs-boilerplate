import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAppDto {
  @ApiPropertyOptional({
    example: 'Updated App Name',
    description: 'New name for the app',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'production',
    description: 'Environment for Apple Push Notification Service',
  })
  apns_env?: 'sandbox' | 'production';
}
