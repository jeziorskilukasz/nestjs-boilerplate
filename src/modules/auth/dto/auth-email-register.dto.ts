import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsLocale,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { IsPasswordStrong } from '~starter/shared/validators/is-password-strong';
import { lowerCaseTransformer } from '~starter/utils/transformers/lower-case.transformer';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'example@email.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  @IsEmail({}, { message: 'Invalid email address.' })
  email: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @IsPasswordStrong({
    message: 'Password does not meet complexity requirements.',
  })
  password?: string;

  @ApiProperty({ example: 'Jon' })
  @IsNotEmpty({ message: 'firstName cannot be empty.' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty({ message: 'lastName cannot be empty.' })
  lastName: string;

  @ApiProperty({
    example: 'en-US',
    description: 'IETF language tags (e.g., en-US).',
  })
  @IsOptional()
  @IsLocale({
    message: 'Locale must be a valid IETF language tag (e.g., en-US).',
  })
  @IsNotEmpty({ message: 'locale cannot be empty.' })
  locale: string;

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'Terms must be a boolean.' })
  @Equals(true, { message: 'Terms must be accepted.' })
  termsAccepted: boolean;

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'Privacy policy must be a boolean.' })
  @Equals(true, { message: 'Privacy policy must be accepted.' })
  privacyPolicyAccepted: boolean;
}
