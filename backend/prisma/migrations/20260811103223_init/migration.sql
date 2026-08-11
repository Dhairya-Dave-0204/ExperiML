-- CreateEnum
CREATE TYPE "account_status" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "device_type" AS ENUM ('DESKTOP', 'LAPTOP', 'MOBILE', 'TABLET', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "project_status" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "dataset_format" AS ENUM ('CSV', 'XLSX', 'PARQUET');

-- CreateEnum
CREATE TYPE "dataset_status" AS ENUM ('UPLOADING', 'PROCESSING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "problem_type" AS ENUM ('CLASSIFICATION', 'REGRESSION', 'CLUSTERING', 'TIME_SERIES', 'ANOMALY_DETECTION');

-- CreateEnum
CREATE TYPE "experiment_status" AS ENUM ('CREATED', 'QUEUED', 'TRAINING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "artifact_type" AS ENUM ('MODEL', 'PREPROCESSING_PIPELINE', 'REPORT', 'PREDICTION_EXPORT', 'FEATURE_IMPORTANCE', 'VISUALIZATION', 'OTHER');

-- CreateEnum
CREATE TYPE "artifact_status" AS ENUM ('GENERATING', 'AVAILABLE', 'FAILED');

-- CreateEnum
CREATE TYPE "prediction_type" AS ENUM ('SINGLE', 'BATCH');

-- CreateEnum
CREATE TYPE "prediction_status" AS ENUM ('CREATED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "account_status" "account_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "operating_system" TEXT NOT NULL,
    "device_type" "device_type" NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "project_status" "project_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "datasets" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "dataset_version" INTEGER NOT NULL,
    "original_file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" BIGINT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "dataset_format" "dataset_format" NOT NULL,
    "row_count" INTEGER NOT NULL,
    "column_count" INTEGER NOT NULL,
    "metadata" JSONB,
    "dataset_status" "dataset_status" NOT NULL DEFAULT 'UPLOADING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "datasets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiments" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "dataset_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "problem_type" "problem_type" NOT NULL,
    "algorithm_name" TEXT NOT NULL,
    "configuration" JSONB NOT NULL,
    "hyperparameters" JSONB NOT NULL,
    "metrics" JSONB,
    "experiment_status" "experiment_status" NOT NULL DEFAULT 'CREATED',
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "experiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artifacts" (
    "id" UUID NOT NULL,
    "experiment_id" UUID NOT NULL,
    "artifact_name" TEXT NOT NULL,
    "artifact_type" "artifact_type" NOT NULL,
    "file_format" TEXT NOT NULL,
    "original_file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" BIGINT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "metadata" JSONB,
    "artifact_status" "artifact_status" NOT NULL DEFAULT 'GENERATING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictions" (
    "id" UUID NOT NULL,
    "experiment_id" UUID NOT NULL,
    "output_artifact_id" UUID,
    "name" TEXT NOT NULL,
    "prediction_type" "prediction_type" NOT NULL,
    "input_file_name" TEXT NOT NULL,
    "input_file_path" TEXT NOT NULL,
    "input_format" "dataset_format" NOT NULL,
    "file_size" BIGINT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "rows_processed" INTEGER NOT NULL,
    "metadata" JSONB,
    "prediction_status" "prediction_status" NOT NULL DEFAULT 'CREATED',
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_sessions_user" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "idx_sessions_expires_at" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "idx_projects_user" ON "projects"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_projects_user_name" ON "projects"("user_id", "name");

-- CreateIndex
CREATE INDEX "idx_datasets_project" ON "datasets"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_datasets_project_name_version" ON "datasets"("project_id", "name", "dataset_version");

-- CreateIndex
CREATE INDEX "idx_experiments_project" ON "experiments"("project_id");

-- CreateIndex
CREATE INDEX "idx_experiments_dataset" ON "experiments"("dataset_id");

-- CreateIndex
CREATE INDEX "idx_artifacts_experiment" ON "artifacts"("experiment_id");

-- CreateIndex
CREATE INDEX "idx_predictions_experiment" ON "predictions"("experiment_id");

-- CreateIndex
CREATE INDEX "idx_predictions_output_artifact" ON "predictions"("output_artifact_id");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "fk_sessions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "fk_projects_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "datasets" ADD CONSTRAINT "fk_datasets_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiments" ADD CONSTRAINT "fk_experiments_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiments" ADD CONSTRAINT "fk_experiments_dataset" FOREIGN KEY ("dataset_id") REFERENCES "datasets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artifacts" ADD CONSTRAINT "fk_artifacts_experiment" FOREIGN KEY ("experiment_id") REFERENCES "experiments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "fk_predictions_experiment" FOREIGN KEY ("experiment_id") REFERENCES "experiments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "fk_predictions_output_artifact" FOREIGN KEY ("output_artifact_id") REFERENCES "artifacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
