import { plainToClass } from 'class-transformer';
import { validate, IsNotEmpty } from 'class-validator';

import { IsPasswordStrong } from '~starter/shared/validators/is-password-strong';

class TestPasswordClass {
  @IsNotEmpty()
  @IsPasswordStrong({
    message: 'Password is not strong enough.',
  })
  password: string;
}

describe('IsPasswordStrong', () => {
  it('should validate a strong password successfully', async () => {
    const model = plainToClass(TestPasswordClass, {
      password: 'Str0ngPassword!',
    });

    const errors = await validate(model);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for a weak password', async () => {
    const model = plainToClass(TestPasswordClass, {
      password: 'weak',
    });

    const errors = await validate(model);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toEqual({
      isPasswordStrong: 'Password is not strong enough.',
    });
  });

  it('should fail validation for a password without special characters', async () => {
    const model = plainToClass(TestPasswordClass, {
      password: 'Password1',
    });

    const errors = await validate(model);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toEqual({
      isPasswordStrong: 'Password is not strong enough.',
    });
  });

  it('should fail validation for a password without uppercase letters', async () => {
    const model = plainToClass(TestPasswordClass, {
      password: 'str0ngpassword!',
    });

    const errors = await validate(model);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toEqual({
      isPasswordStrong: 'Password is not strong enough.',
    });
  });

  it('should fail validation for a password without lowercase letters', async () => {
    const model = plainToClass(TestPasswordClass, {
      password: 'STR0NGPASSWORD!',
    });

    const errors = await validate(model);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toEqual({
      isPasswordStrong: 'Password is not strong enough.',
    });
  });

  it('should fail validation for a password without numbers', async () => {
    const model = plainToClass(TestPasswordClass, {
      password: 'StrongPassword!',
    });

    const errors = await validate(model);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toEqual({
      isPasswordStrong: 'Password is not strong enough.',
    });
  });

  it('should fail validation for a password that is too short', async () => {
    const model = plainToClass(TestPasswordClass, {
      password: 'Str0!',
    });

    const errors = await validate(model);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toEqual({
      isPasswordStrong: 'Password is not strong enough.',
    });
  });

  it('should validate a password that meets all criteria', async () => {
    const model = plainToClass(TestPasswordClass, {
      password: 'Valid1Pass!',
    });

    const errors = await validate(model);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for an empty password', async () => {
    const model = plainToClass(TestPasswordClass, {
      password: '',
    });

    const errors = await validate(model);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toEqual({
      isPasswordStrong: 'Password is not strong enough.',
      isNotEmpty: 'password should not be empty',
    });
  });

  it('should fail validation for a password with numbers only', async () => {
    const model = plainToClass(TestPasswordClass, {
      password: '12345678',
    });

    const errors = await validate(model);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toEqual({
      isPasswordStrong: 'Password is not strong enough.',
    });
  });

  it('should fail validation for a password with special characters only', async () => {
    const model = plainToClass(TestPasswordClass, {
      password: '!@#$%^&*',
    });

    const errors = await validate(model);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toEqual({
      isPasswordStrong: 'Password is not strong enough.',
    });
  });
});
