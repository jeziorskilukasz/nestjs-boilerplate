import { ApiProperty } from '@nestjs/swagger';
import { RoleName, User } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';

import { LastConsentEntity } from '~starter/consent/entity/consent.entity';
import { Role } from '~starter/roles/domain/role';
import { Status } from '~starter/statuses/domain/status';
import { StatusNameEnum } from '~starter/statuses/statuses.enum';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8' })
  id: string;

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2022-02-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: null })
  deletedAt: Date | null;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'google' })
  provider: string;

  @ApiProperty({ example: '102209777480561953757' })
  socialId: string;

  @ApiProperty({ example: 'en-US' })
  locale: string;

  @ApiProperty({
    type: () => Role,
    example: { id: 2, name: RoleName.USER },
  })
  role: Role;

  @ApiProperty({
    type: () => Status,
    example: { id: 1, name: StatusNameEnum.active },
  })
  status: Status;

  @ApiProperty({
    type: () => LastConsentEntity,
    required: false,
  })
  @Transform(({ value }: { value: LastConsentEntity[] }) => {
    if (value && value.length === 1) {
      return new LastConsentEntity(value[0]);
    }
    if (value && value.length > 0) {
      const sortedValues = value.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
      const latestConsent = sortedValues[0];
      return new LastConsentEntity(latestConsent);
    }
  })
  consent?: LastConsentEntity[];

  @Exclude()
  roleId: number;

  @Exclude()
  statusId: number;

  @Exclude()
  hash: string;

  @Exclude()
  password: string;
}
