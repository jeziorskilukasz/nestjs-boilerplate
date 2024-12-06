import { SetMetadata } from '@nestjs/common';

import { RoleIdEnum, RoleNameEnum } from '~starter/roles/roles.enum';

export const Roles = (...roles: number[]) => SetMetadata('roles', roles);

export const convertToRoleNameEnum = (roleName: string): RoleNameEnum => {
  switch (roleName) {
    case 'ADMIN':
      return RoleNameEnum.admin;
    case 'USER':
      return RoleNameEnum.user;
    default:
      throw new Error(`Unknown error: ${roleName}`);
  }
};

export const convertRoleIdToRoleNameEnum = (roleId: number): RoleNameEnum => {
  switch (roleId) {
    case RoleIdEnum.admin:
      return RoleNameEnum.admin;
    case RoleIdEnum.user:
      return RoleNameEnum.user;
    default:
      throw new Error(`Unknown error: ${roleId}`);
  }
};
