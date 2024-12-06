import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthFacebookLoginDto {
  @ApiProperty({
    example: 'EAAJ3MZA...ZDZD',
    description:
      'Access token obtained from Facebook after successful authentication.',
  })
  @IsString({ message: 'Access token from Facebook must be string type.' })
  @IsNotEmpty({ message: 'Access token from Facebook is required.' })
  accessToken: string;
}
