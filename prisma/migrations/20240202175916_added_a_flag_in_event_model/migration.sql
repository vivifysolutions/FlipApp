-- CreateEnum
CREATE TYPE "flag" AS ENUM ('Public', 'Private');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "falg" "flag";
