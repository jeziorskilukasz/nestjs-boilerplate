import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { AuthRegisterLoginDto } from '~starter/modules/auth/dto/auth-email-register.dto';

describe('AuthRegisterLoginDto', () => {
  it('should fail validation for empty required fields', async () => {
    const dto = plainToInstance(AuthRegisterLoginDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((error) => error.property === 'email')).toBeTruthy();
    expect(errors.some((error) => error.property === 'password')).toBeTruthy();
    expect(errors.some((error) => error.property === 'firstName')).toBeTruthy();
    expect(errors.some((error) => error.property === 'lastName')).toBeTruthy();
    expect(
      errors.some((error) => error.property === 'termsAccepted'),
    ).toBeTruthy();
    expect(
      errors.some((error) => error.property === 'privacyPolicyAccepted'),
    ).toBeTruthy();
  });

  it('should validate email transformation to lowercase', async () => {
    const dto = plainToInstance(AuthRegisterLoginDto, {
      email: 'EXAMPLE@EMAIL.COM',
      password: 'ValidPassword123!',
      firstName: 'Jon',
      lastName: 'Doe',
      termsAccepted: true,
      privacyPolicyAccepted: true,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.email).toBe('example@email.com');
  });

  it('should fail for weak password', async () => {
    const dto = plainToInstance(AuthRegisterLoginDto, {
      email: 'example@email.com',
      password: 'weak',
      firstName: 'Jon',
      lastName: 'Doe',
      termsAccepted: true,
      privacyPolicyAccepted: true,
    });
    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError.constraints.isPasswordStrong).toBe(
      'Password does not meet complexity requirements.',
    );
  });

  it('should fail when terms and privacy policy are not accepted', async () => {
    const dto = plainToInstance(AuthRegisterLoginDto, {
      email: 'example@email.com',
      password: 'ValidPassword123!',
      firstName: 'Jon',
      lastName: 'Doe',
      termsAccepted: false,
      privacyPolicyAccepted: false,
    });
    const errors = await validate(dto);
    expect(
      errors.some((error) => error.property === 'termsAccepted'),
    ).toBeTruthy();
    expect(
      errors.some((error) => error.property === 'privacyPolicyAccepted'),
    ).toBeTruthy();
    expect(
      errors.find((error) => error.property === 'termsAccepted').constraints
        .equals,
    ).toBe('Terms must be accepted.');
    expect(
      errors.find((error) => error.property === 'privacyPolicyAccepted')
        .constraints.equals,
    ).toBe('Privacy policy must be accepted.');
  });
});
