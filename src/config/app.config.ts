import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

import { AppConfig } from '~starter/config/app-config.type';
import validateConfig from '~starter/utils/validate-config';

enum Environment {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
}
class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  APP_BACKEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  APP_FRONTEND_DOMAIN: string;

  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  let port: number;

  if (process.env.APP_PORT) {
    port = parseInt(process.env.APP_PORT, 10);
  } else if (process.env.PORT) {
    port = parseInt(process.env.PORT, 10);
  } else {
    port = 3000;
  }

  return {
    apiPrefix: process.env.API_PREFIX || 'api',
    backendDomain: process.env.APP_BACKEND_DOMAIN ?? 'http://localhost',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    frontendDomain: process.env.APP_FRONTEND_DOMAIN,
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
    name: process.env.APP_NAME || 'app',
    nodeEnv: process.env.NODE_ENV || 'development',
    port,
    workingDirectory: process.env.PWD || process.cwd(),
  };
});
