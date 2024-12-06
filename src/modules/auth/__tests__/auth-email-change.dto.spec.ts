import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import { AuthEmailChangeDto } from '~starter/modules/auth/dto/auth-email-change.dto';

describe('AuthEmailChangeDto', () => {
  it('should fail validation for an invalid email format', async () => {
    const dto = plainToInstance(AuthEmailChangeDto, {
      email: 'invalidEmail',
    });
    const errors: ValidationError[] = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isEmail).toBe('Invalid email format.');
  });

  it('should transform email to lowercase and pass validation for a valid email format', async () => {
    const inputEmail = 'example@email.com';
    const dto = plainToInstance(AuthEmailChangeDto, {
      email: inputEmail,
    });
    const errors: ValidationError[] = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.email).toBe(inputEmail.toLowerCase());
  });
});
