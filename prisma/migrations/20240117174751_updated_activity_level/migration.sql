/*
  Warnings:

  - The `skillLevel` column on the `UserActivity` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('Advanced_Level', 'Intermediate_level', 'Beginner_level', 'Newbie');

-- AlterTable
ALTER TABLE "UserActivity" DROP COLUMN "skillLevel",
ADD COLUMN     "skillLevel" "SkillLevel" NOT NULL DEFAULT 'Newbie';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "bio" DROP NOT NULL;
