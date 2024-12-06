import { ApiProperty } from '@nestjs/swagger';

export class CreateAppDto {
  @ApiProperty({ example: 'My New App', description: 'Name of the app' })
  name: string;

  @ApiProperty({
    example: 'sandbox',
    description: 'Environment for Apple Push Notification Service',
    required: false,
  })
  apns_env?: 'sandbox' | 'production';

  @ApiProperty({
    example: 'org_12345',
    description: 'Organization ID associated with the app',
    required: false,
  })
  organization_id?: string;
}
