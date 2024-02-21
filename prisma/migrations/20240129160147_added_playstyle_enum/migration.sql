-- CreateEnum
CREATE TYPE "playStyle" AS ENUM ('Competitive', 'Casual');

-- AlterTable
ALTER TABLE "UserActivity" ADD COLUMN     "playStyle" "playStyle" NOT NULL DEFAULT 'Casual';
