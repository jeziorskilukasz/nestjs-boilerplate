import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { AuthForgotPasswordDto } from '~starter/modules/auth/dto/auth-forgot-password.dto';

describe('AuthForgotPasswordDto', () => {
  it('should fail validation for an invalid email format', async () => {
    const dto = plainToInstance(AuthForgotPasswordDto, {
      email: 'invalidEmail',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isEmail).toBe('Invalid email format.');
  });

  it('should pass validation for a valid email format', async () => {
    const validEmail = 'ValidEmail@Email.com';
    const dto = plainToInstance(AuthForgotPasswordDto, {
      email: validEmail,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should transform email to lowercase', async () => {
    const mixedCaseEmail = 'Example@Email.COM';
    const dto = plainToInstance(AuthForgotPasswordDto, {
      email: mixedCaseEmail,
    });
    await validate(dto);
    expect(dto.email).toBe(mixedCaseEmail.toLowerCase());
  });
});
