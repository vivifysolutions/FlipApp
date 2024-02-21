/*
  Warnings:

  - You are about to drop the column `activity_name` on the `UserActivity` table. All the data in the column will be lost.
  - Added the required column `activity_id` to the `UserActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserActivity" DROP COLUMN "activity_name",
ADD COLUMN     "activity_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
