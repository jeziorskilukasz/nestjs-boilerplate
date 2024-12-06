import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsLocale,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { RoleDto } from '~starter/roles/dto/role.dto';
import { IsPasswordStrong } from '~starter/shared/validators/is-password-strong';
import { StatusDto } from '~starter/statuses/dto/status.dto';
import { lowerCaseTransformer } from '~starter/utils/transformers/lower-case.transformer';

export class CreateUserDto {
  @ApiProperty({
    example: 'example@email.com',
    description: 'The email address of the user.',
  })
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @ApiProperty({
    example: 'NewSecurePassword123!',
    description: 'The password for the user account.',
  })
  @IsOptional()
  @IsPasswordStrong({
    message: 'Password does not meet complexity requirements.',
  })
  password?: string;

  @IsOptional()
  @IsString({ message: 'Provider must be a string.' })
  provider?: string;

  @IsOptional()
  @IsString({ message: 'Social ID must be a string.' })
  socialId?: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user.' })
  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user.' })
  @IsNotEmpty({ message: 'Last name is required.' })
  lastName: string;

  @ApiProperty({
    example: 'en-US',
    description: 'IETF language tags (e.g., en-US).',
  })
  @IsLocale({
    message: 'Locale must be a valid IETF language tag (e.g., en-US).',
  })
  @IsNotEmpty({ message: 'locale cannot be empty.' })
  locale: string;

  @ApiProperty({
    type: RoleDto,
    description: 'The role assigned to the user.',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RoleDto)
  role?: RoleDto;

  @ApiProperty({
    type: StatusDto,
    description: 'The status of the user account.',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StatusDto)
  status?: StatusDto;
}
