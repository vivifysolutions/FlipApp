/*
  Warnings:

  - You are about to drop the column `connectedUserId` on the `Connection` table. All the data in the column will be lost.
  - Added the required column `receivingUserId` to the `Connection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sendingUserId` to the `Connection` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_connectedUserId_fkey";

-- AlterTable
ALTER TABLE "Connection" DROP COLUMN "connectedUserId",
ADD COLUMN     "receivingUserId" INTEGER NOT NULL,
ADD COLUMN     "sendingUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_sendingUserId_fkey" FOREIGN KEY ("sendingUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_receivingUserId_fkey" FOREIGN KEY ("receivingUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
