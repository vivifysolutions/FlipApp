/*
  Warnings:

  - You are about to drop the column `falg` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "falg",
ADD COLUMN     "flag" "flag" DEFAULT 'Public';
