/*
  Warnings:

  - A unique constraint covering the columns `[rental_request_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transaction_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transaction_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "transaction_id" TEXT NOT NULL,
ALTER COLUMN "paid_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "payments_rental_request_id_key" ON "payments"("rental_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");
