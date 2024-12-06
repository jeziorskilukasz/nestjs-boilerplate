import { registerAs } from '@nestjs/config';
import { IsInt, IsOptional, IsString } from 'class-validator';

import { SystemConfig } from '~starter/modules/system/config/system-config.type';
import validateConfig from '~starter/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  ANDROID_BUNDLE_ID: string;

  @IsString()
  IOS_BUNDLE_ID: string;

  @IsInt()
  @IsOptional()
  DEFAULT_FORCE_UPDATE_PERIOD: number;
}

export default registerAs<SystemConfig>('system', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    androidBundleId:
      process.env.ANDROID_BUNDLE_ID || 'com.google.android.youtube',
    iosBundleId: process.env.IOS_BUNDLE_ID || 'com.google.ios.youtube',
    defaultForceUpdatePeriod:
      parseInt(process.env.DEFAULT_FORCE_UPDATE_PERIOD) || 14,
  };
});
