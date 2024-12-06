import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthAppleService } from '~starter/modules/auth-apple/auth-apple.service';
import { AuthAppleLoginDto } from '~starter/modules/auth-apple/dto/auth-apple-login.dto';

jest.mock('apple-signin-auth', () => ({
  verifyIdToken: jest.fn().mockResolvedValue({
    sub: '12345',
    email: 'user@example.com',
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
            get: jest.fn().mockReturnValue('expectedAudienceValue'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthAppleService>(AuthAppleService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('getProfileByToken should return a profile', async () => {
    const loginDto: AuthAppleLoginDto = {
      idToken: 'fakeIdToken',
      firstName: 'John',
      lastName: 'Doe',
    };

    const profile = await service.getProfileByToken(loginDto);

    expect(profile).toBeDefined();
    expect(profile.id).toEqual('12345');
    expect(profile.email).toEqual('user@example.com');
    expect(profile.firstName).toEqual('John');
    expect(profile.lastName).toEqual('Doe');
  });
});
