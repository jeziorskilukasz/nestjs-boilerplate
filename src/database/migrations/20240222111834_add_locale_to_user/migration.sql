-- AlterTable
ALTER TABLE "Consent" ALTER COLUMN "termsAccepted" SET DEFAULT true,
ALTER COLUMN "privacyPolicyAccepted" SET DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "locale" TEXT DEFAULT 'en-US';
