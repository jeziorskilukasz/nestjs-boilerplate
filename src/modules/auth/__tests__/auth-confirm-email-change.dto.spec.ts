import { validate } from 'class-validator';

import { AuthConfirmEmailChangeDto } from '~starter/modules/auth/dto/auth-confirm-email-change.dto';
import { HashTypes } from '~starter/modules/auth/strategies/types/hash-type';

describe('AuthConfirmEmailChangeDto Tests', () => {
  it('should fail validation when hash is empty', async () => {
    const dto = new AuthConfirmEmailChangeDto();
    dto.hash = '' as HashTypes;
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints.isNotEmpty).toBeDefined();
  });

  it.each(['confirmEmail', 'forgotPassword', 'changeEmail'] as HashTypes[])(
    'should pass validation with hash type: %s',
    async (hashType) => {
      const dto = new AuthConfirmEmailChangeDto();
      dto.hash = hashType;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    },
  );
});
