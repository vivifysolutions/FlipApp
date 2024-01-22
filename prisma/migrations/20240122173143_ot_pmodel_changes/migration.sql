-- CreateEnum
CREATE TYPE "emailType" AS ENUM ('EMAIL', 'PHONE');

-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "type" "emailType" NOT NULL DEFAULT 'PHONE';
