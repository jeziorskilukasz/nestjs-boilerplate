import { validate } from 'class-validator';

import { AuthFacebookLoginDto } from '~starter/modules/auth-facebook/dto/auth-facebook-login.dto';

describe('AuthFacebookLoginDto', () => {
  it('should validate that accessToken is not empty and is a string', async () => {
    const dto = new AuthFacebookLoginDto();

    let errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual(
      expect.objectContaining({
        isNotEmpty: 'Access token from Facebook is required.',
      }),
    );

    dto.accessToken = 123 as any;
    errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual(
      expect.objectContaining({
        isString: 'Access token from Facebook must be string type.',
      }),
    );

    dto.accessToken = 'EAAJ3MZA...ZDZD';
    errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
