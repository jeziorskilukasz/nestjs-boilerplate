import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { IsPasswordStrong } from '~starter/shared/validators/is-password-strong';

export class AuthResetPasswordDto {
  @ApiProperty({
    example: 'NewSecurePassword123!',
    description: "The new password for resetting the user's password.",
  })
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @IsPasswordStrong({
    message: 'Password does not meet complexity requirements.',
  })
  password: string;

  @ApiProperty({
    example: 'a1b2c3d4e5f6g7h8i9j0',
    description: "The hash token required for resetting the user's password.",
  })
  @IsNotEmpty({ message: 'Hash cannot be empty.' })
  hash: string;
}
