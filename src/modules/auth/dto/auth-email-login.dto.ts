import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

import { lowerCaseTransformer } from '~starter/utils/transformers/lower-case.transformer';

export class AuthEmailLoginDto {
  @ApiProperty({
    example: 'example@email.com',
    description: 'The email address used for logging in.',
  })
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  @ApiProperty({
    example: 'YourSecurePassword123!',
    description: 'The password used for logging in.',
  })
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  password: string;
}
