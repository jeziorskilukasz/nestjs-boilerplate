import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { NotificationsController } from '~starter/modules/notifications/notifications.controller';
import { NotificationService } from '~starter/modules/notifications/notifications.service';

@Module({
  imports: [ConfigModule],
  controllers: [NotificationsController],
  providers: [NotificationService, ConfigService],
})
export class NotificationsModule {}
