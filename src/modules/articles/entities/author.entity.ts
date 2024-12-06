import { ApiProperty } from '@nestjs/swagger';

export class AuthorPublicDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  constructor(partial: Partial<AuthorPublicDto>) {
    Object.assign(this, partial);
  }
}
