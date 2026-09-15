/*
  Warnings:

  - A unique constraint covering the columns `[execution_id]` on the table `experiments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "experiments" ADD COLUMN     "execution_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "experiments_execution_id_key" ON "experiments"("execution_id");
