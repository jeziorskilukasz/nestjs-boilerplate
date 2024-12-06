import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { AuthEmailLoginDto } from '~starter/modules/auth/dto/auth-email-login.dto';

describe('AuthEmailLoginDto', () => {
  it('should fail validation for an invalid email format and empty password', async () => {
    const dto = plainToInstance(AuthEmailLoginDto, {
      email: 'invalidEmail',
      password: '',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(2);
    const emailError = errors.find((error) => error.property === 'email');
    const passwordError = errors.find((error) => error.property === 'password');
    expect(emailError.constraints.isEmail).toBe('Invalid email format.');
    expect(passwordError.constraints.isNotEmpty).toBe(
      'Password cannot be empty.',
    );
  });

  it('should transform email to lowercase and pass validation for valid email and password', async () => {
    const inputEmail = 'example@email.com';
    const inputPassword = 'YourSecurePassword123!';
    const dto = plainToInstance(AuthEmailLoginDto, {
      email: inputEmail,
      password: inputPassword,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.email).toBe(inputEmail.toLowerCase());
    expect(dto.password).toBe(inputPassword);
  });
});
