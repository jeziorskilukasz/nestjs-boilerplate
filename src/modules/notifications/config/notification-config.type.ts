export type NotificationConfig = {
  appId: string;
  userKey: string;
  apiKey: string;
};

export enum NotificationEnvironment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}
