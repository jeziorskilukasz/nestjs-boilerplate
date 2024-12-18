import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

import { AuthConfig } from '~starter/modules/auth/config/auth-config.type';
import validateConfig from '~starter/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  AUTH_JWT_SECRET: string;

  @IsString()
  AUTH_JWT_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_REFRESH_SECRET: string;

  @IsString()
  AUTH_REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_FORGOT_SECRET: string;

  @IsString()
  AUTH_FORGOT_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_CONFIRM_EMAIL_SECRET: string;

  @IsString()
  AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    confirmEmailExpires: process.env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
    confirmEmailSecret: process.env.AUTH_CONFIRM_EMAIL_SECRET,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    forgotPasswordExpires: process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN,
    forgotPasswordSecret: process.env.AUTH_FORGOT_SECRET,
    changeEmailExpires: process.env.AUTH_CHANGE_EMAIL_TOKEN_EXPIRES_IN,
    changeEmailSecret: process.env.AUTH_CHANGE_EMAIL_SECRET,
    refreshExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    refreshSecret: process.env.AUTH_REFRESH_SECRET,
    secret: process.env.AUTH_JWT_SECRET,
  };
});
