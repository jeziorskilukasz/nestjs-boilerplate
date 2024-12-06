import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum OperatingSystem {
  android = 'android',
  ios = 'ios',
}

export class CheckUpdateDto {
  @ApiProperty({
    example: 'ios',
    description:
      'The operating system for which to check the update. Can be either "android" or "ios".',
    enum: OperatingSystem,
  })
  @IsEnum(OperatingSystem, { message: 'OS must be either "android" or "ios".' })
  os: keyof typeof OperatingSystem;

  @ApiProperty({
    example: '1.2.0',
    description: 'The current version of the app installed on the device.',
  })
  @IsString({ message: 'Current version must be a string type.' })
  @IsNotEmpty({ message: 'Current version is required.' })
  currentVersion: string;
}
