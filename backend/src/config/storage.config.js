import path from "path";
import { fileURLToPath } from "url";

import { env } from "./env.config.js";

// Resolve current directory because the project uses ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directory for all uploaded files
const UPLOAD_ROOT = path.resolve(__dirname, "../../uploads");

// Root directory for system-generated artifacts
const ARTIFACT_STORAGE_ROOT = path.resolve(__dirname, "../../storage");

export const storageConfig = {
  /*
   * Active storage provider.
   *
   * Current:
   * local filesystem
   *
   * Future:
   * cloudinary
   */
  provider: env.STORAGE_PROVIDER || "local",

  /*
   * Base upload directory
   *
   * backend/uploads/
   *
   * Used for user-provided files.
   * Currently:
   * - dataset uploads
   */
  rootPath: UPLOAD_ROOT,

  /*
   * Temporary upload location
   *
   * backend/uploads/temp/
   *
   * Used during:
   * - file upload
   * - validation
   * - processing
   */
  tempPath: path.join(UPLOAD_ROOT, "temp"),

  /*
   * Permanent project storage location
   *
   * backend/uploads/projects/
   *
   * Dataset structure:
   * projects/
   *   <projectId>/
   *      datasets/
   *          <datasetId>/
   *              data.csv
   */
  projectsPath: path.join(UPLOAD_ROOT, "projects"),

  /*
   * Artifact storage location
   * backend/storage/artifacts/
   *
   * Used for: system-generated experiment artifacts
   *
   * Future structure:
   * artifacts/
   *   <projectId>/
   *      <experimentId>/
   *          model.joblib
   *          metrics.json
   *          report.pdf
   */
  artifactsPath: path.join(ARTIFACT_STORAGE_ROOT, "artifacts"),
};
