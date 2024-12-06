import { validate } from 'class-validator';

import { AuthUpdateDto } from '~starter/modules/auth/dto/auth-update.dto';

describe('AuthUpdateDto', () => {
  it('should allow optional fields to be omitted and not validate if not provided', async () => {
    const dto = new AuthUpdateDto();

    dto.password = 'NewSecurePassword123!';
    let errors = await validate(dto);
    expect(errors.length).toBe(0);

    dto.firstName = '';
    dto.lastName = '';
    dto.locale = '';
    errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate password strength if provided', async () => {
    const dto = new AuthUpdateDto();
    dto.password = 'weak';
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'password')).toBeTruthy();
  });
});
