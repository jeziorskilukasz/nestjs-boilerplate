import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { HashTypes } from '~starter/modules/auth/strategies/types/hash-type';

export class AuthConfirmEmailDto {
  @ApiProperty({
    example: 'a1b2c3d4e5f6g7h8i9j0',
    description: 'The confirmation hash received in the email.',
  })
  @IsNotEmpty({ message: 'The hash must not be empty.' })
  hash: HashTypes;
}
