import { SetMetadata as setMeta } from '@nestjs/common';

import {
  Statuses,
  convertStatusIdToNameEnum,
} from '~starter/statuses/status.decorator';
import { StatusEnum, StatusNameEnum } from '~starter/statuses/statuses.enum';

jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn(),
}));

describe('Statuses Decorator', () => {
  it('should call SetMetadata with "statuses" and the provided statuses array', () => {
    const statuses = [1, 2];
    const SetMetadata = setMeta;

    Statuses(...statuses);

    expect(SetMetadata).toHaveBeenCalledWith('statuses', statuses);
  });
});

describe('convertStatusIdToNameEnum', () => {
  it('should return the correct StatusNameEnum for a given StatusEnum', () => {
    expect(convertStatusIdToNameEnum(StatusEnum.active)).toEqual(
      StatusNameEnum.active,
    );
    expect(convertStatusIdToNameEnum(StatusEnum.inactive)).toEqual(
      StatusNameEnum.inactive,
    );
  });

  it('should throw an error for an unknown statusId', () => {
    const unknownStatusId = 999;
    expect(() => convertStatusIdToNameEnum(unknownStatusId)).toThrow(
      `Unknown error: ${unknownStatusId}`,
    );
  });
});
