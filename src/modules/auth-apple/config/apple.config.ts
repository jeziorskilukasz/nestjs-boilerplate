import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';

import { AppleConfig } from '~starter/modules/auth-apple/config/apple-config.type';
import validateConfig from '~starter/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  APPLE_APP_AUDIENCE: string;
}

export default registerAs<AppleConfig>('apple', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    appAudience: process.env.APPLE_APP_AUDIENCE ?? '',
  };
});
