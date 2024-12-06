import { ApiProperty } from '@nestjs/swagger';
import { IsLocale, IsNotEmpty, IsOptional } from 'class-validator';

import { IsPasswordStrong } from '~starter/shared/validators/is-password-strong';

export class AuthUpdateDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user.',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'firstName cannot be empty.' })
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user.',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'lastName cannot be empty.' })
  lastName?: string;

  @ApiProperty({
    example: 'en-US',
    description: 'IETF language tags (e.g., en-US).',
    required: false,
  })
  @IsOptional()
  @IsLocale({
    message: 'Locale must be a valid IETF language tag (e.g., en-US).',
  })
  @IsNotEmpty({ message: 'locale cannot be empty.' })
  locale?: string;

  @ApiProperty({
    example: 'NewSecurePassword123!',
    description: 'The new password for updating user credentials.',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @IsPasswordStrong({
    message: 'Password does not meet complexity requirements.',
  })
  password?: string;

  @ApiProperty({
    example: 'OldSecurePassword123!',
    description:
      'The old password required for security verification when updating user credentials.',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'oldPassword cannot be empty.' })
  @IsPasswordStrong({
    message: 'Password does not meet complexity requirements.',
  })
  oldPassword?: string;
}
