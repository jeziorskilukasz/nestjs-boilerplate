import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthGoogleService } from '~starter/modules/auth-google/auth-google.service';

jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        setCredentials: jest.fn(),
      })),
    },
    oauth2: jest.fn().mockReturnValue({
      userinfo: {
        get: jest.fn().mockResolvedValue({
          data: {
            email: 'test@example.com',
            given_name: 'John',
            family_name: 'Doe',
            id: '12345',
          },
        }),
      },
    }),
  },
}));

describe('AuthGoogleService', () => {
  let googleAuthService: AuthGoogleService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGoogleService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'google.clientId') return 'googleClientId';
              if (key === 'google.clientSecret') return 'googleClientSecret';
            }),
            getOrThrow: jest.fn().mockImplementation((key) => {
              if (key === 'google.clientId') return 'googleClientId';
            }),
          },
        },
      ],
    }).compile();

    googleAuthService = module.get<AuthGoogleService>(AuthGoogleService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('AuthGoogleService should be defined', () => {
    expect(googleAuthService).toBeDefined();
  });

  it('ConfigService should be defined', () => {
    expect(configService).toBeDefined();
  });

  it('getProfileByToken should return user profile for valid token', async () => {
    const loginDto = { accessToken: 'validToken' };
    const result = await googleAuthService.getProfileByToken(loginDto);

    expect(result).toEqual({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      id: '12345',
    });
  });
});
