import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export type FilterExpressionRelationEnum =
  | '>'
  | '<'
  | '='
  | '!='
  | 'exists'
  | 'not_exists'
  | 'time_elapsed_gt'
  | 'time_elapsed_lt';

export type FilterExpressionOperatorEnum = 'OR' | 'AND';

export class CreateNotificationDto {
  @ApiProperty({
    example: ['Subscribed Users'],
    description: 'Target segments',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  included_segments?: string[];

  @ApiPropertyOptional({
    example: ['Inactive Users'],
    description: 'Segments to exclude from the notification',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excluded_segments?: string[];

  @ApiPropertyOptional({
    example: ['abc123', 'def456'],
    description: 'Subscription IDs to include in the notification',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  include_subscription_ids?: string[];

  @ApiPropertyOptional({
    example: ['user1@example.com', 'user2@example.com'],
    description: 'Email tokens to include in the notification',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  include_email_tokens?: string[];

  @ApiPropertyOptional({
    example: ['+1234567890', '+0987654321'],
    description: 'Phone numbers to include in the notification',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  include_phone_numbers?: string[];

  @ApiPropertyOptional({
    example: ['ios_device_token_1', 'ios_device_token_2'],
    description: 'Device tokens for iOS devices',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  include_ios_tokens?: string[];

  @ApiPropertyOptional({
    example: { en: 'Hello World!', es: '¡Hola Mundo!' },
    description: 'Content map in multiple languages',
  })
  @IsOptional()
  @IsObject()
  contents?: { [language: string]: string };

  @ApiPropertyOptional({
    example: { en: 'Breaking News', fr: 'Dernières nouvelles' },
    description: 'Headings map in multiple languages',
  })
  @IsOptional()
  @IsObject()
  headings?: { [language: string]: string };

  @ApiPropertyOptional({
    example: { en: 'Optional subtitle', fr: 'Sous-titre facultatif' },
    description: 'Subtitle map in multiple languages',
  })
  @IsOptional()
  @IsObject()
  subtitle?: { [language: string]: string };

  @ApiPropertyOptional({
    example: 'https://example.com',
    description: 'URL to open when the notification is clicked',
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/web',
    description: 'Web URL to open for Chrome and Firefox notifications',
  })
  @IsOptional()
  @IsString()
  web_url?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/app',
    description: 'App URL to open for Android and iOS notifications',
  })
  @IsOptional()
  @IsString()
  app_url?: string;

  @ApiPropertyOptional({
    example: 'Test Notification',
    description: 'Name of the notification for tracking purposes',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'external-notification-id',
    description: 'External ID for deduplication or tracking',
  })
  @IsOptional()
  @IsString()
  external_id?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/image.png',
    description: 'Big picture URL for Android notifications',
  })
  @IsOptional()
  @IsString()
  big_picture?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/image.png',
    description: 'Big picture URL for Chrome notifications',
  })
  @IsOptional()
  @IsString()
  chrome_big_picture?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icon.png',
    description: 'Icon URL for Chrome notifications',
  })
  @IsOptional()
  @IsString()
  chrome_web_icon?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icon.png',
    description: 'Icon URL for Firefox notifications',
  })
  @IsOptional()
  @IsString()
  firefox_icon?: string;

  @ApiPropertyOptional({
    example: [
      {
        id: 'button1',
        text: 'Click Me',
        icon: 'https://example.com/button.png',
      },
    ],
    description: 'Custom buttons for notifications',
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  buttons?: Array<{
    id: string;
    text: string;
    icon?: string;
  }>;

  @ApiPropertyOptional({
    example: [
      { id: 'web_button1', text: 'Learn More', url: 'https://example.com' },
    ],
    description: 'Web-specific buttons for notifications',
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  web_buttons?: Array<{
    id: string;
    text: string;
    url?: string;
  }>;

  @ApiPropertyOptional({
    example: { key1: 'value1', key2: 'value2' },
    description: 'Custom data sent with the notification',
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the notification should use mutable content on iOS',
  })
  @IsOptional()
  @IsBoolean()
  mutable_content?: boolean;

  @ApiPropertyOptional({
    example: '2024-12-01T10:00:00Z',
    description: 'Time to delay the notification until',
  })
  @IsOptional()
  @IsString()
  send_after?: string;

  @ApiPropertyOptional({
    example: 3600,
    description: 'Time to live for the notification in seconds',
  })
  @IsOptional()
  @IsNumber()
  ttl?: number;

  @ApiPropertyOptional({
    example: { field: 'tag', key: 'user_type', value: 'admin' },
    description: 'Filters to target specific audiences',
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  filters?: Array<{
    field?: string;
    key?: string;
    value?: string;
    hours_ago?: string;
    radius?: number;
    lat?: number;
    long?: number;
    relation?: FilterExpressionRelationEnum;
    operator?: FilterExpressionOperatorEnum;
  }>;

  @ApiPropertyOptional({
    example: {
      en: 'You have a new message',
      es: 'Tienes un nuevo mensaje',
    },
    description: 'Localized message for notification collapse ID',
  })
  @IsOptional()
  @IsObject()
  collapse_id?: string;

  @ApiPropertyOptional({
    example: 'SetTo',
    description:
      "Specify how the notification affects the badge count displayed on your app's icon",
  })
  @IsOptional()
  @IsString()
  ios_badge_type?: 'SetTo' | 'Increase' | 'None';

  @ApiPropertyOptional({
    example: 1,
    description: 'The provided value must be a whole number.',
  })
  @IsOptional()
  @IsNumber()
  ios_badge_count?: number;
}
