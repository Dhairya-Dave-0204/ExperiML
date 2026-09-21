-- AlterTable
ALTER TABLE "predictions" ALTER COLUMN "input_file_name" DROP NOT NULL,
ALTER COLUMN "input_file_path" DROP NOT NULL,
ALTER COLUMN "input_format" DROP NOT NULL,
ALTER COLUMN "file_size" DROP NOT NULL,
ALTER COLUMN "mime_type" DROP NOT NULL,
ALTER COLUMN "checksum" DROP NOT NULL;
