import { Test, TestingModule } from '@nestjs/testing';

import { AuthProvidersEnum } from '~starter/modules/auth/auth-providers.enum';
import { AuthService } from '~starter/modules/auth/auth.service';
import { AuthEntity } from '~starter/modules/auth/entity/auth.entity';
import { AuthFacebookController } from '~starter/modules/auth-facebook/auth-facebook.controller';
import { AuthFacebookService } from '~starter/modules/auth-facebook/auth-facebook.service';
import { AuthFacebookLoginDto } from '~starter/modules/auth-facebook/dto/auth-facebook-login.dto';
import { UserEntity } from '~starter/modules/users/entities/user.entity';
import { RoleNameEnum } from '~starter/roles/roles.enum';
import { StatusNameEnum } from '~starter/statuses/statuses.enum';

jest.mock('~starter/modules/auth-facebook/auth-facebook.service');
jest.mock('~starter/modules/auth/auth.service');
jest.mock('~starter/providers/prisma/prisma.service');

describe('AuthFacebookController', () => {
  let controller: AuthFacebookController;
  let authFacebookService: AuthFacebookService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthFacebookController],
      providers: [AuthFacebookService, AuthService],
    }).compile();

    controller = module.get<AuthFacebookController>(AuthFacebookController);
    authFacebookService = module.get<AuthFacebookService>(AuthFacebookService);
    authService = module.get<AuthService>(AuthService);
  });

  it('AuthFacebookController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('AuthFacebookService should be defined', () => {
    expect(authFacebookService).toBeDefined();
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('login should process social login and return auth entity', async () => {
    const loginDto: AuthFacebookLoginDto = { accessToken: 'validToken' };
    const socialData = {
      id: '123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    const userEntityPartial = {
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
      status: {
        id: 1,
        name: StatusNameEnum.active,
      },
      consent: [],
    };

    const authEntityPartial = {
      accessToken: 'fakeAccessToken',
      refreshToken: 'fakeRefreshToken',
      tokenExpires: Date.now() + 1000000,
      user: new UserEntity(userEntityPartial),
    };

    jest
      .spyOn(authFacebookService, 'getProfileByToken')
      .mockResolvedValue(socialData);
    jest
      .spyOn(authService, 'loginWithSocial')
      .mockResolvedValue(authEntityPartial);

    const result = await controller.login(loginDto);

    expect(result).toEqual(new AuthEntity(authEntityPartial));
    expect(authFacebookService.getProfileByToken).toHaveBeenCalledWith(
      loginDto,
    );
    expect(authService.loginWithSocial).toHaveBeenCalledWith(
      AuthProvidersEnum.facebook,
      socialData,
    );
  });
});
