import { plainToInstance } from 'class-transformer';

import { LastConsentEntity } from '~starter/consent/entity/consent.entity';

describe('LastConsentEntity', () => {
  it('should correctly assign all properties from partial input', () => {
    const partialInput = {
      id: 'someId',
      userId: 'someUserId',
      termsAccepted: true,
      privacyPolicyAccepted: true,
      termsVersion: '1.0',
      privacyPolicyVersion: '1.0',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-02T00:00:00.000Z'),
    };

    const lastConsentEntity = new LastConsentEntity(partialInput);

    expect(lastConsentEntity.termsAccepted).toBe(partialInput.termsAccepted);
    expect(lastConsentEntity.privacyPolicyAccepted).toBe(
      partialInput.privacyPolicyAccepted,
    );
    expect(lastConsentEntity.termsVersion).toBe(partialInput.termsVersion);
    expect(lastConsentEntity.privacyPolicyVersion).toBe(
      partialInput.privacyPolicyVersion,
    );
    expect(lastConsentEntity.createdAt).toBe(partialInput.createdAt);
    expect(lastConsentEntity.updatedAt).toBe(partialInput.updatedAt);
  });

  it('should exclude properties marked with @Exclude when transforming', () => {
    const partialInput = {
      id: 'someId',
      userId: 'someUserId',
      termsAccepted: true,
      privacyPolicyAccepted: true,
      termsVersion: '1.0',
      privacyPolicyVersion: '1.0',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-02T00:00:00.000Z'),
    };

    const lastConsentEntity = plainToInstance(LastConsentEntity, partialInput);

    const transformed = JSON.stringify(lastConsentEntity);
    expect(transformed).not.toMatch(/"id"/);
    expect(transformed).not.toMatch(/"userId"/);
  });
});
