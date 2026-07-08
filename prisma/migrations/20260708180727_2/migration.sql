/*
  Warnings:

  - You are about to drop the column `is_muted` on the `rental_requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rental_requests" DROP COLUMN "is_muted",
ADD COLUMN     "is_app" BOOLEAN NOT NULL DEFAULT false;
