import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsLocale,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { CreateUserDto } from '~starter/modules/users/dto/create-user.dto';
import { RoleDto } from '~starter/roles/dto/role.dto';
import { IsPasswordStrong } from '~starter/shared/validators/is-password-strong';
import { StatusDto } from '~starter/statuses/dto/status.dto';
import { lowerCaseTransformer } from '~starter/utils/transformers/lower-case.transformer';

export default class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'example@email.com',
    description: 'The updated email address of the user.',
  })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiProperty({
    description: 'The updated password for the user account.',
    example: 'NewSecurePassword123!',
  })
  @IsOptional()
  @IsPasswordStrong({
    message: 'Password does not meet complexity requirements.',
  })
  password?: string;

  @ApiProperty({
    description: 'The provider associated with the user account.',
  })
  provider?: string;

  @ApiProperty({
    description: 'The social ID associated with the user account.',
  })
  socialId?: string | null;

  @ApiProperty({
    example: 'John',
    description: 'The updated first name of the user.',
  })
  @IsOptional()
  firstName?: string | null;

  @ApiProperty({
    example: 'Doe',
    description: 'The updated last name of the user.',
  })
  @IsOptional()
  lastName?: string | null;

  @ApiProperty({
    example: 'en-US',
    description: 'IETF language tags (e.g., en-US).',
  })
  @IsOptional()
  @IsLocale({
    message: 'Locale must be a valid IETF language tag (e.g., en-US).',
  })
  @IsNotEmpty({ message: 'locale cannot be empty.' })
  locale?: string;

  @ApiProperty({
    type: RoleDto,
    description: 'The updated role assigned to the user.',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RoleDto)
  role?: RoleDto;

  @ApiProperty({
    type: StatusDto,
    description: 'The updated status of the user account.',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StatusDto)
  status?: StatusDto;
}
