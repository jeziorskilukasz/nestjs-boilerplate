import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

import { lowerCaseTransformer } from '~starter/utils/transformers/lower-case.transformer';

export class AuthForgotPasswordDto {
  @ApiProperty({
    example: 'example@email.com',
    description: 'The email address associated with the user account.',
  })
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;
}
