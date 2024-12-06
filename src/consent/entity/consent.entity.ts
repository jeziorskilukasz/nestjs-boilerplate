import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class LastConsentEntity {
  constructor(partial: Partial<LastConsentEntity>) {
    Object.assign(this, partial);
  }

  @Exclude()
  id: string;

  @Exclude()
  userId: string;

  @ApiProperty({
    example: true,
    description: 'Whether the terms were accepted.',
  })
  termsAccepted: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the privacy policy was accepted.',
  })
  privacyPolicyAccepted: boolean;

  @ApiProperty({
    example: '1.0',
    description: 'Version of terms.',
  })
  termsVersion: string;

  @ApiProperty({
    example: '1.0',
    description: 'Version of privacy policy.',
  })
  privacyPolicyVersion: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description:
      'The date and time when the consents were last created or the user agreed to the terms for the first time.',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00.000Z',
    description:
      'The date and time of the last update to the consents, indicating when the user last modified their agreement or the consents were refreshed.',
  })
  updatedAt: Date;
}
