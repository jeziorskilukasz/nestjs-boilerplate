import {
  convertRoleIdToRoleNameEnum,
  convertToRoleNameEnum,
} from '~starter/roles/roles.decorator';
import { RoleIdEnum, RoleNameEnum } from '~starter/roles/roles.enum';

describe('convertToRoleNameEnum', () => {
  it('should convert known role names to RoleNameEnum values', () => {
    expect(convertToRoleNameEnum('ADMIN')).toBe(RoleNameEnum.admin);
    expect(convertToRoleNameEnum('USER')).toBe(RoleNameEnum.user);
  });

  it('should throw an error for unknown role names', () => {
    expect(() => convertToRoleNameEnum('UNKNOWN_ROLE')).toThrow(
      'Unknown error: UNKNOWN_ROLE',
    );
  });
});

describe('convertRoleIdToRoleNameEnum', () => {
  it('should convert known role ids to RoleNameEnum values', () => {
    expect(convertRoleIdToRoleNameEnum(RoleIdEnum.admin)).toBe(
      RoleNameEnum.admin,
    );
    expect(convertRoleIdToRoleNameEnum(RoleIdEnum.user)).toBe(
      RoleNameEnum.user,
    );
  });

  it('should throw an error for unknown role ids', () => {
    expect(() => convertRoleIdToRoleNameEnum(999)).toThrow(
      'Unknown error: 999',
    );
  });
});
