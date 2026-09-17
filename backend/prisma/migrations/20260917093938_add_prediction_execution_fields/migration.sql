/*
  Warnings:

  - The values [CANCELLED] on the enum `prediction_status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[execution_id]` on the table `predictions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "prediction_status_new" AS ENUM ('CREATED', 'RUNNING', 'COMPLETED', 'FAILED');
ALTER TABLE "public"."predictions" ALTER COLUMN "prediction_status" DROP DEFAULT;
ALTER TABLE "predictions" ALTER COLUMN "prediction_status" TYPE "prediction_status_new" USING ("prediction_status"::text::"prediction_status_new");
ALTER TYPE "prediction_status" RENAME TO "prediction_status_old";
ALTER TYPE "prediction_status_new" RENAME TO "prediction_status";
DROP TYPE "public"."prediction_status_old";
ALTER TABLE "predictions" ALTER COLUMN "prediction_status" SET DEFAULT 'CREATED';
COMMIT;

-- AlterTable
ALTER TABLE "predictions" ADD COLUMN     "execution_id" UUID,
ALTER COLUMN "rows_processed" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "predictions_execution_id_key" ON "predictions"("execution_id");
