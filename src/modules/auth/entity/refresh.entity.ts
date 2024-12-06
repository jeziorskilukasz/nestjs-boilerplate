import { ApiProperty } from '@nestjs/swagger';

export class RefreshEntity {
  @ApiProperty({
    example: 'eyJhb...adQssw5c',
    description: 'The access token for authentication.',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhb...adQssw5c',
    description: 'The refresh token for refreshing the access token.',
  })
  refreshToken: string;

  @ApiProperty({
    example: 1708531622031,
    description: 'The expiry date of the access token.',
  })
  tokenExpires: number;
}
