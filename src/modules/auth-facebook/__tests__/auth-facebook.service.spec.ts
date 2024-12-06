import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthFacebookService } from '~starter/modules/auth-facebook/auth-facebook.service';

jest.mock('fb', () => ({
  Facebook: jest.fn().mockImplementation(() => ({
    setAccessToken: jest.fn(),
    api: jest.fn((_path, _method, _params, callback) =>
      callback({
        id: '123',
        email: 'user@example.com',
        first_name: 'John',
        last_name: 'Doe',
      }),
    ),
  })),
}));

describe('AuthFacebookService', () => {
  let service: AuthFacebookService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthFacebookService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'facebook.appId') return 'testAppId';
              if (key === 'facebook.appSecret') return 'testAppSecret';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthFacebookService>(AuthFacebookService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('auth facebook service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('config service should be defined', () => {
    expect(configService).toBeDefined();
  });

  it('auth facebook service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getProfileByToken should return user profile', async () => {
    const profile = await service.getProfileByToken({
      accessToken: 'validToken',
    });

    expect(profile).toBeDefined();
    expect(profile.id).toEqual('123');
    expect(profile.email).toEqual('user@example.com');
    expect(profile.firstName).toEqual('John');
    expect(profile.lastName).toEqual('Doe');
  });
});
