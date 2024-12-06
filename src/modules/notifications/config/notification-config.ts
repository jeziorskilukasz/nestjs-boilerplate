import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

import { NotificationConfig } from '~starter/modules/notifications/config/notification-config.type';
import validateConfig from '~starter/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  ONESIGNAL_APP_ID: string;

  @IsString()
  ONESIGNAL_USER_KEY: string;

  @IsString()
  ONESIGNAL_API_KEY: string;
}

export default registerAs<NotificationConfig>('notification', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    appId: process.env.ONESIGNAL_APP_ID,
    userKey: process.env.ONESIGNAL_USER_KEY,
    apiKey: process.env.ONESIGNAL_API_KEY,
  };
});
