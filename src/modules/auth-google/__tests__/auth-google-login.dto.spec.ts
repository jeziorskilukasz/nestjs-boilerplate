import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { AuthGoogleLoginDto } from '~starter/modules/auth-google/dto/auth-google-login.dto';

describe('AuthGoogleLoginDto', () => {
  it('should validate the token presence', async () => {
    const dto = plainToInstance(AuthGoogleLoginDto, {});
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toBeDefined();
    expect(errors[0].constraints.isString).toBeDefined();
    expect(errors[0].constraints.isNotEmpty).toBeDefined();
  });

  it('should validate the token is a string', async () => {
    const dto = plainToInstance(AuthGoogleLoginDto, { accessToken: 123 });
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isString).toBeDefined();
  });

  it('should pass validation for valid data', async () => {
    const dto = plainToInstance(AuthGoogleLoginDto, {
      accessToken: 'validTokenString',
    });
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
