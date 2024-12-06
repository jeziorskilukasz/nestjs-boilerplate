import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '~starter/modules/users/entities/user.entity';

export class AuthEntity {
  constructor(partial: Partial<AuthEntity>) {
    Object.assign(this, partial);
    if (partial.user) {
      this.user = new UserEntity(partial.user);
    }
  }

  @ApiProperty({
    description: 'The access token for authentication.',
    example: 'eyJhb...adQssw5c',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The refresh token for refreshing the access token.',
    example: 'eyJhb...adQssw5c',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'The expiry timestamp of the access token.',
    example: 1708531622031,
  })
  tokenExpires: number;

  @ApiProperty({
    type: () => UserEntity,
    description: 'The user entity associated with the authentication.',
  })
  user: UserEntity;
}
