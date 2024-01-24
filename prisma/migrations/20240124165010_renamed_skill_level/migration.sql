/*
  Warnings:

  - You are about to drop the column `skillLevels` on the `Activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "skillLevels",
ADD COLUMN     "skillLevel" "SkillLevel" NOT NULL DEFAULT 'Newbie';
