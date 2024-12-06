import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthAppleService } from '~starter/modules/auth-apple/auth-apple.service';
import { AuthAppleLoginDto } from '~starter/modules/auth-apple/dto/auth-apple-login.dto';

jest.mock('apple-signin-auth', () => ({
  verifyIdToken: jest.fn().mockImplementation((idToken) => {
    if (idToken === 'validToken') {
      return Promise.resolve({
        sub: '12345',
        email: 'test@example.com',
      });
    } else {
      throw new Error('Invalid token');
    }
  }),
}));

describe('AuthAppleService', () => {
  let service: AuthAppleService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthAppleService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'apple.appAudience') return 'expectedAudience';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthAppleService>(AuthAppleService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('apple auth service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('config service should be defined', () => {
    expect(configService).toBeDefined();
  });

  it('getProfileByToken should return user profile for valid token', async () => {
    const loginDto: AuthAppleLoginDto = {
      idToken: 'validToken',
      firstName: 'John',
      lastName: 'Doe',
    };

    const userProfile = await service.getProfileByToken(loginDto);

    expect(userProfile).toBeDefined();
    expect(userProfile.id).toEqual('12345');
    expect(userProfile.email).toEqual('test@example.com');
    expect(userProfile.firstName).toEqual('John');
    expect(userProfile.lastName).toEqual('Doe');
  });

  it('getProfileByToken should throw for invalid token', async () => {
    const loginDto: AuthAppleLoginDto = {
      idToken: 'invalidToken',
      firstName: 'John',
      lastName: 'Doe',
    };

    await expect(service.getProfileByToken(loginDto)).rejects.toThrow(
      'Invalid token',
    );
  });
});
