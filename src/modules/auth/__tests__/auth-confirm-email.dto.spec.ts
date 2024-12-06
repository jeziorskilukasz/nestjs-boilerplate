import { validate } from 'class-validator';

import { AuthConfirmEmailDto } from '~starter/modules/auth/dto/auth-confirm-email.dto';
import { HashTypes } from '~starter/modules/auth/strategies/types/hash-type';

describe('AuthConfirmEmailDto Tests', () => {
  it('should fail validation when hash is empty', async () => {
    const dto = new AuthConfirmEmailDto();
    dto.hash = '' as HashTypes;
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints.isNotEmpty).toBeDefined();
    expect(errors[0].constraints.isNotEmpty).toBe(
      'The hash must not be empty.',
    );
  });

  it.each(['confirmEmail', 'forgotPassword', 'changeEmail'] as HashTypes[])(
    'should pass validation with hash type: %s',
    async (hashType) => {
      const dto = new AuthConfirmEmailDto();
      dto.hash = hashType;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    },
  );
});
