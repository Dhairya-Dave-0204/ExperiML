import multer from "multer";
import path from "path";

import { storageConfig } from "#config/storage.config";
import { env } from "#config/env.config";

const uploadStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, storageConfig.tempPath);
  },

  filename: (req, file, cb) => {
    /*
     * Temporary filename.
     *
     * We intentionally do not use
     * original filename as storage identity.
     *
     * Final naming will happen during
     * permanent storage movement.
     */

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const extension = path.extname(file.originalname);

    cb(null, `${uniqueSuffix}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".csv", ".xlsx", ".parquet"];

  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return cb(new Error("Unsupported file format"), false);
  }

  cb(null, true);
};

export const upload = multer({
  storage: uploadStorage,

  limits: {
    fileSize: Number(env.MAX_DATASET_FILE_SIZE) || 100 * 1024 * 1024,
  },

  fileFilter,
});
