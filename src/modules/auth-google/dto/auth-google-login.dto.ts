import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthGoogleLoginDto {
  @ApiProperty({
    example: 'EAAJ3MZA...ZDZD',
    description:
      'Google Access token obtained after user authentication using Google OAuth. Use this token to authenticate the request to the application.',
  })
  @IsString({ message: 'Access token from Google must be string type.' })
  @IsNotEmpty({ message: 'Access token from Google is required.' })
  accessToken: string;
}
