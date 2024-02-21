/*
  Warnings:

  - The `status` column on the `EventAttendee` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EventAttendeeStatus" AS ENUM ('Unregistered', 'Registered');

-- AlterTable
ALTER TABLE "EventAttendee" DROP COLUMN "status",
ADD COLUMN     "status" "EventAttendeeStatus" NOT NULL DEFAULT 'Unregistered';
