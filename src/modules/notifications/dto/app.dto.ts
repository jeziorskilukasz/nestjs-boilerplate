import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AppDto {
  @ApiProperty({
    example: '12345',
    description: 'Unique identifier of the app',
  })
  id?: string;

  @ApiProperty({ example: 'My App', description: 'Name of the app' })
  name?: string;

  @ApiProperty({
    example: 1000,
    description: 'Number of players registered in the app',
  })
  players?: number;

  @ApiProperty({
    example: 800,
    description: 'Number of players who can receive messages',
  })
  messageable_players?: number;

  @ApiProperty({
    example: '2024-01-01T10:00:00Z',
    description: 'Last updated timestamp of the app',
  })
  updated_at?: string;

  @ApiProperty({
    example: '2023-01-01T10:00:00Z',
    description: 'Timestamp when the app was created',
  })
  created_at?: string;

  @ApiPropertyOptional({
    example: 'sandbox',
    description: 'Environment for Apple Push Notification Service',
  })
  apns_env?: 'sandbox' | 'production';

  @ApiPropertyOptional({
    example: 'org_12345',
    description: 'Organization ID associated with the app',
  })
  organization_id?: string;

  @ApiPropertyOptional({
    example: true,
    description:
      'Whether additional data should be part of the root payload in notifications',
  })
  additional_data_is_root_payload?: boolean;

  @ApiPropertyOptional({
    example: '1234567890',
    description: 'Sender ID for Android GCM (deprecated)',
  })
  android_gcm_sender_id?: string;

  @ApiPropertyOptional({
    example: 'AIzaSyD...5F1FG',
    description: 'Server key for Google Cloud Messaging',
  })
  gcm_key?: string;

  @ApiPropertyOptional({
    example: 'https://example.com',
    description: 'Origin for Chrome Web Push notifications',
  })
  chrome_web_origin?: string;

  @ApiPropertyOptional({
    example: 'AAAA...1:APA9...',
    description: 'Key for Chrome Web Push notifications',
  })
  chrome_key?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icon.png',
    description: 'Default icon for Chrome Web Push notifications',
  })
  chrome_web_default_notification_icon?: string;

  @ApiPropertyOptional({
    example: 'example-subdomain',
    description: 'Subdomain for Chrome Web Push notifications',
  })
  chrome_web_sub_domain?: string;

  @ApiPropertyOptional({
    example: 'example.com',
    description: 'Origin for Safari Push notifications',
  })
  safari_site_origin?: string;

  @ApiPropertyOptional({
    example: 'web.com.example',
    description: 'Push ID for Safari notifications',
  })
  safari_push_id?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icon-16x16.png',
    description: '16x16 icon for Safari notifications',
  })
  safari_icon_16_16?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icon-32x32.png',
    description: '32x32 icon for Safari notifications',
  })
  safari_icon_32_32?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icon-64x64.png',
    description: '64x64 icon for Safari notifications',
  })
  safari_icon_64_64?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icon-128x128.png',
    description: '128x128 icon for Safari notifications',
  })
  safari_icon_128_128?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icon-256x256.png',
    description: '256x256 icon for Safari notifications',
  })
  safari_icon_256_256?: string;

  @ApiPropertyOptional({
    example: 'My Website',
    description: 'Site name for web push notifications',
  })
  site_name?: string;

  @ApiPropertyOptional({
    example: 'auth_key_123',
    description: 'Basic authentication key for the app',
  })
  basic_auth_key?: string;

  @ApiPropertyOptional({
    example: 'team123',
    description: 'Team ID for Apple Push Notifications',
  })
  apns_team_id?: string;

  @ApiPropertyOptional({
    example: 'bundle123',
    description: 'Bundle ID for Apple Push Notifications',
  })
  apns_bundle_id?: string;

  @ApiPropertyOptional({
    example: 'key123',
    description: 'Key ID for Apple Push Notifications',
  })
  apns_key_id?: string;

  @ApiPropertyOptional({
    example: 'safari-push-cert.pem',
    description: 'Certificates for Safari Push notifications',
  })
  safari_apns_certificates?: string;
}
