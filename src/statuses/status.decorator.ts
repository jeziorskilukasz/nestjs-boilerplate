import { SetMetadata } from '@nestjs/common';

import { StatusEnum, StatusNameEnum } from '~starter/statuses/statuses.enum';

export const Statuses = (...statuses: number[]) =>
  SetMetadata('statuses', statuses);

export const convertStatusIdToNameEnum = (statusId: number): StatusNameEnum => {
  switch (statusId) {
    case StatusEnum.active:
      return StatusNameEnum.active;
    case StatusEnum.inactive:
      return StatusNameEnum.inactive;
    default:
      throw new Error(`Unknown error: ${statusId}`);
  }
};
