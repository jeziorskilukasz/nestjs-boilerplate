import { AppConfig } from '~starter/config/app-config.type';
import { AuthConfig } from '~starter/modules/auth/config/auth-config.type';
import { AppleConfig } from '~starter/modules/auth-apple/config/apple-config.type';
import { FacebookConfig } from '~starter/modules/auth-facebook/config/facebook-config.type';
import { GoogleConfig } from '~starter/modules/auth-google/config/google-config.type';
import { FileConfig } from '~starter/modules/files/config/file-config.type';
import { NotificationConfig } from '~starter/modules/notifications/config/notification-config.type';
import { SystemConfig } from '~starter/modules/system/config/system-config.type';
import { MailConfig } from '~starter/providers/mail/config/mail-config.type';
import { RedisConfig } from '~starter/providers/redis/config/redis-config.type';

export type AllConfigType = {
  app: AppConfig;
  apple: AppleConfig;
  auth: AuthConfig;
  facebook: FacebookConfig;
  file: FileConfig;
  google: GoogleConfig;
  mail: MailConfig;
  notification: NotificationConfig;
  redis: RedisConfig;
  system: SystemConfig;
};
