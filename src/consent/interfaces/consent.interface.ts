export interface LastConsent {
  createdAt: Date;
  updatedAt: Date;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
  termsVersion: string;
  privacyPolicyVersion: string;
}
