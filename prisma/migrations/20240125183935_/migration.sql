/*
  Warnings:

  - A unique constraint covering the columns `[phonenumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_phonenumber_key" ON "users"("phonenumber");
