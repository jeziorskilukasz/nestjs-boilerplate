import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsString } from 'class-validator';

export class AuthAppleLoginDto {
  @ApiProperty({
    example: 'eyJra...vbmNlIn0',
    description: 'The identity token issued by Apple, encoded in JWT format.',
  })
  @IsString({ message: 'The idToken from Apple must be string type.' })
  @IsNotEmpty({ message: 'The idToken from Apple is required.' })
  idToken: string;

  @Allow()
  @ApiProperty({
    required: false,
    example: 'John',
    description:
      'The first name of the user. This field is optional and can be provided by Apple during the first sign-in.',
  })
  firstName?: string;

  @Allow()
  @ApiProperty({
    required: false,
    example: 'Doe',
    description:
      'The last name of the user. This field is optional and can be provided by Apple during the first sign-in.',
  })
  lastName?: string;
}
