-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "date" DROP DEFAULT,
ALTER COLUMN "date" SET DATA TYPE TEXT,
ALTER COLUMN "time" DROP DEFAULT,
ALTER COLUMN "time" SET DATA TYPE TEXT;
