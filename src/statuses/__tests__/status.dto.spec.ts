import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { StatusDto } from '~starter/statuses/dto/status.dto';

describe('StatusDto', () => {
  it('should validate that id is a number', async () => {
    const validDto = plainToClass(StatusDto, {
      id: 1,
    });

    let errors = await validate(validDto);
    expect(errors.length).toBe(0);

    const invalidDtoWithString = plainToClass(StatusDto, {
      id: 'not a number',
    });

    errors = await validate(invalidDtoWithString);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNumber');

    const invalidDtoWithBoolean = plainToClass(StatusDto, {
      id: true,
    });

    errors = await validate(invalidDtoWithBoolean);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });
});
