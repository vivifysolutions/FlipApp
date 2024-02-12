-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "isOtpEmailUsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOtpPhoneUsed" BOOLEAN NOT NULL DEFAULT false;
