/*
  Warnings:

  - The values [completed] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.

*/

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "isClosed" BOOLEAN NOT NULL DEFAULT false;

-- Update Ticket Table
UPDATE public."Ticket"
	SET status='reviewed', "isClosed"=true
	WHERE status='completed';

-- AlterEnum
BEGIN;
CREATE TYPE "TicketStatus_new" AS ENUM ('new', 'testing', 'reviewed', 'development');
ALTER TABLE "Ticket" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "status" TYPE "TicketStatus_new" USING ("status"::text::"TicketStatus_new");
ALTER TYPE "TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "TicketStatus_old";
ALTER TABLE "Ticket" ALTER COLUMN "status" SET DEFAULT 'new';
COMMIT;