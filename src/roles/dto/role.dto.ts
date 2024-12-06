import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { Role } from '~starter/roles/domain/role';
import { RoleIdEnum } from '~starter/roles/roles.enum';

export class RoleDto implements Role {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the role.',
  })
  @IsEnum(RoleIdEnum)
  id: number;
}
