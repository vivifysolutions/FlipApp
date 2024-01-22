/*
  Warnings:

  - You are about to drop the column `otp` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Otp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "otp",
DROP COLUMN "type",
ADD COLUMN     "otpEmail" INTEGER,
ADD COLUMN     "otpPhone" INTEGER;

-- DropEnum
DROP TYPE "emailType";
