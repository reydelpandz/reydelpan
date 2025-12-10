-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "image" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "isUnderPressure" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
