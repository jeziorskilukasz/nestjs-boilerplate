import { validate } from 'class-validator';

import { AuthAppleLoginDto } from './auth-apple-login.dto';

describe('AuthAppleLoginDto', () => {
  it('should validate that idToken is not empty and is a string', async () => {
    const dto = new AuthAppleLoginDto();

    dto.idToken = '';
    let errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual(
      expect.objectContaining({
        isNotEmpty: 'The idToken from Apple is required.',
      }),
    );

    dto.idToken = 123 as any;
    errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual(
      expect.objectContaining({
        isString: 'The idToken from Apple must be string type.',
      }),
    );

    dto.idToken = 'eyJra...vbmNlIn0';
    errors = await validate(dto);
    expect(errors).toHaveLength(0);

    dto.firstName = 'John';
    dto.lastName = 'Doe';
    errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
