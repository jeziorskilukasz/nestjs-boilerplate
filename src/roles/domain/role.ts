import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsEnum } from 'class-validator';

import { RoleIdEnum, RoleNameEnum } from '~starter/roles/roles.enum';

export class Role {
  @Allow()
  @IsEnum(RoleIdEnum)
  @ApiProperty({
    example: RoleIdEnum.user,
    description: 'Role ID, where 1 is for User and 2 is for Admin',
    enum: RoleIdEnum,
  })
  id: RoleIdEnum;

  @Allow()
  @IsEnum(RoleNameEnum)
  @ApiProperty({
    example: RoleNameEnum.user,
    description: 'Role name, which can be either user or admin',
    enum: RoleNameEnum,
  })
  name?: RoleNameEnum;
}
