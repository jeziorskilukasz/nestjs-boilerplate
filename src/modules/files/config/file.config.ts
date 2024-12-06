import { registerAs } from '@nestjs/config';
import { IsEnum } from 'class-validator';

import {
  FileConfig,
  FileDriver,
} from '~starter/modules/files/config/file-config.type';
import validateConfig from '~starter/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsEnum(FileDriver)
  FILE_UPLOAD_TYPE: FileDriver;
}

export default registerAs<FileConfig>('file', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    driver:
      (process.env.FILE_UPLOAD_TYPE as FileDriver | undefined) ??
      FileDriver.LOCAL,
    maxFileSize: 5242880, // 5MB
  };
});
