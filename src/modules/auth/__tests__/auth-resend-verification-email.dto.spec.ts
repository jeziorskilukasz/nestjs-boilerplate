import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { AuthResendVerificationEmailDto } from '~starter/modules/auth/dto/auth-resend-verification-email.dto';

describe('AuthResendVerificationEmailDto', () => {
  it('should fail validation for an invalid email format', async () => {
    const dto = plainToInstance(AuthResendVerificationEmailDto, {
      email: 'invalidEmailFormat',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isEmail).toBe('Invalid email format.');
  });

  it('should pass validation for a valid email format', async () => {
    const validEmail = 'Valid.Email@example.com';
    const dto = plainToInstance(AuthResendVerificationEmailDto, {
      email: validEmail,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should transform email to lowercase', async () => {
    const mixedCaseEmail = 'Test.Email@Example.COM';
    const dto = plainToInstance(AuthResendVerificationEmailDto, {
      email: mixedCaseEmail,
    });
    await validate(dto);
    expect(dto.email).toBe(mixedCaseEmail.toLowerCase());
  });
});
