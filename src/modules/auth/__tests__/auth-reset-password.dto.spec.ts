import { validate } from 'class-validator';

import { AuthResetPasswordDto } from '~starter/modules/auth/dto/auth-reset-password.dto';

describe('AuthResetPasswordDto', () => {
  it('should validate that password and hash are not empty and password is strong', async () => {
    const dto = new AuthResetPasswordDto();
    dto.password = '';
    dto.hash = '';
    let errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    dto.password = 'weakpassword';
    dto.hash = 'a1b2c3d4e5f6g7h8i9j0';
    errors = await validate(dto);
    expect(errors.some((error) => error.property === 'password')).toBeTruthy();

    dto.password = 'NewSecurePassword123!';
    errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
