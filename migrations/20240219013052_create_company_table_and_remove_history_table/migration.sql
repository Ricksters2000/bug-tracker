/*
  Warnings:

  - You are about to drop the `History` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "companyId" TEXT NOT NULL DEFAULT 'dummy';

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "companyId" TEXT NOT NULL DEFAULT 'dummy';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyId" TEXT NOT NULL DEFAULT 'dummy';

-- DropTable
DROP TABLE "History";

-- DropEnum
DROP TYPE "HistoryType";

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

INSERT INTO public."Company"(
	id, "name")
	VALUES ('dummy', 'Dummy inc.');

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
