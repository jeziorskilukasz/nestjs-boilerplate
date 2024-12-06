import { Test, TestingModule } from '@nestjs/testing';

import { AuthProvidersEnum } from '~starter/modules/auth/auth-providers.enum';
import { AuthService } from '~starter/modules/auth/auth.service';
import { AuthEntity } from '~starter/modules/auth/entity/auth.entity';
import { AuthGoogleController } from '~starter/modules/auth-google/auth-google.controller';
import { AuthGoogleService } from '~starter/modules/auth-google/auth-google.service';
import { AuthGoogleLoginDto } from '~starter/modules/auth-google/dto/auth-google-login.dto';
import { UserEntity } from '~starter/modules/users/entities/user.entity';

jest.mock('~starter/modules/auth-google/auth-google.service');
jest.mock('~starter/modules/auth/auth.service');

describe('AuthGoogleController', () => {
  let controller: AuthGoogleController;
  let authGoogleService: AuthGoogleService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthGoogleController],
      providers: [AuthGoogleService, AuthService],
    }).compile();

    controller = module.get<AuthGoogleController>(AuthGoogleController);
    authGoogleService = module.get<AuthGoogleService>(AuthGoogleService);
    authService = module.get<AuthService>(AuthService);
  });

  it('AuthGoogleController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('AuthGoogleService should be defined', () => {
    expect(authGoogleService).toBeDefined();
  });

  it('AuthService should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('login should process social login and return auth entity', async () => {
    const loginDto: AuthGoogleLoginDto = { accessToken: 'validToken' };
    const socialData = {
      id: '12345',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    const userEntityPartial = {
      id: 'a1b2c3d4',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    const authEntityPartial = {
      accessToken: 'fakeAccessToken',
      refreshToken: 'fakeRefreshToken',
      tokenExpires: Date.now() + 1000000,
      user: new UserEntity(userEntityPartial),
    };

    jest
      .spyOn(authGoogleService, 'getProfileByToken')
      .mockResolvedValue(socialData);
    jest
      .spyOn(authService, 'loginWithSocial')
      .mockResolvedValue(authEntityPartial);

    const result = await controller.login(loginDto);

    expect(result).toEqual(new AuthEntity(authEntityPartial));
    expect(authGoogleService.getProfileByToken).toHaveBeenCalledWith(loginDto);
    expect(authService.loginWithSocial).toHaveBeenCalledWith(
      AuthProvidersEnum.google,
      socialData,
    );
  });
});
