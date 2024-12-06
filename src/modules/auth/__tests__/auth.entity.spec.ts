import { AuthEntity } from '~starter/modules/auth/entity/auth.entity';
import { UserEntity } from '~starter/modules/users/entities/user.entity';
import { RoleNameEnum } from '~starter/roles/roles.enum';
import { StatusNameEnum } from '~starter/statuses/statuses.enum';

describe('AuthEntity', () => {
  it('should create an instance with provided values', () => {
    const userPartial = {
      id: 'a1b2c3d4',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      provider: 'facebook',
      socialId: '102209777480561953757',
      locale: 'en-US',
      role: {
        id: 2,
        name: RoleNameEnum.user,
      },
      roleId: 2,
      statusId: 1,
      status: {
        id: 1,
        name: StatusNameEnum.active,
      },
      consent: [],
    };

    const authEntity = new AuthEntity({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      tokenExpires: 123456789,
      user: new UserEntity(userPartial),
    });

    expect(authEntity.accessToken).toBe('access-token');
    expect(authEntity.refreshToken).toBe('refresh-token');
    expect(authEntity.tokenExpires).toBe(123456789);
    expect(authEntity.user).toBeInstanceOf(UserEntity);
    expect(authEntity.user.email).toBe(userPartial.email);
    expect(authEntity.user.firstName).toBe(userPartial.firstName);
    expect(authEntity.user.lastName).toBe(userPartial.lastName);

    expect(authEntity.user.id).toBe(userPartial.id);
    expect(authEntity.user.provider).toBe(userPartial.provider);
    expect(authEntity.user.role).toEqual(userPartial.role);
    expect(authEntity.user.status).toEqual(userPartial.status);
  });
});
