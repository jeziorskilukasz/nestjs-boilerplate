import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionTypeEnum } from '@onesignal/node-onesignal';
import { Allow } from 'class-validator';

export class UserNotificationEntity {
  constructor(partial: Partial<UserNotificationEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: { external_id: 'user_external_id', email: 'user@example.com' },
    description: 'User identity key-value pairs',
  })
  @Allow()
  identity: { [key: string]: string };

  @ApiProperty({
    example: {
      tags: { premium: true },
      language: 'en',
      timezone_id: 'Europe/Warsaw',
      amount_spent: 100,
      purchases: [
        { sku: 'premium_upgrade', amount: '9.99', iso: 'USD', count: 1 },
      ],
    },
    description: 'Properties associated with the user',
  })
  @Allow()
  properties?: {
    tags?: { [key: string]: any };
    language?: string;
    timezone_id?: string;
    lat?: number;
    long?: number;
    country?: string;
    first_active?: number;
    last_active?: number;
    amount_spent?: number;
    purchases?: Array<{
      sku: string;
      amount: string;
      iso: string;
      count?: number;
    }>;
    ip?: string;
  };

  @ApiProperty({
    example: [
      {
        id: 'subscription_id',
        type: 'iOSPush',
        token: 'abc123',
        enabled: true,
        notification_types: 3,
      },
    ],
    description: 'Array of subscriptions associated with the user',
  })
  @Allow()
  subscriptions?: Array<{
    id?: string;
    type?: SubscriptionTypeEnum;
    token?: string;
    enabled?: boolean;
    notification_types?: number;
    session_time?: number;
    session_count?: number;
    sdk?: string;
    device_model?: string;
    device_os?: string;
    rooted?: boolean;
    app_version?: string;
    carrier?: string;
  }>;
}
