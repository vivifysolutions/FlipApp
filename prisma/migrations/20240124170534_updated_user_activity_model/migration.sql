/*
  Warnings:

  - You are about to drop the column `skillLevel` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `useractivityId` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `activity_name` to the `UserActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_useractivityId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "skillLevel",
DROP COLUMN "useractivityId";

-- AlterTable
ALTER TABLE "UserActivity" ADD COLUMN     "activity_name" TEXT NOT NULL,
ADD COLUMN     "skillLevel" "SkillLevel" NOT NULL DEFAULT 'Newbie';
