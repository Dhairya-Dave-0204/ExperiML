import path from "path";
import { fileURLToPath } from "url";

import { env } from "./env.config.js";

// Resolve current directory because the project uses ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directory for user-provided uploaded files
const UPLOAD_ROOT = path.resolve(__dirname, "../../uploads");

// Root directory for system-managed storage
const STORAGE_ROOT = path.resolve(__dirname, "../../storage");

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
   * User upload directory: backend/uploads/
   *
   * Used for:
   * - dataset uploads
   * - user-provided files
   */
  rootPath: UPLOAD_ROOT,

  /*
   * Temporary upload location: backend/uploads/temp/
   *
   * Used during:
   * - file upload
   * - validation
   * - processing
   */
  tempPath: path.join(UPLOAD_ROOT, "temp"),

  /*
   * Permanent dataset storage location: backend/uploads/projects/
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
   * System-generated artifact storage location: backend/storage/artifacts/
   *
   * Used for:
   * - models
   * - metrics
   * - reports
   * - plots
   * - logs
   *
   * Structure:
   * artifacts/
   *   <projectId>/
   *      <experimentId>/
   *          model.joblib
   *          metrics.json
   *          report.pdf
   */
  artifactsPath: path.join(STORAGE_ROOT, "artifacts"),

  /*
   * Prediction input storage location: backend/storage/predictions/
   *
   * Used for:
   * - prediction input files
   *
   * Prediction structure:
   * predictions/
   *   <projectId>/
   *      <experimentId>/
   *          <predictionId>/
   *              input.csv
   * Note:
   * The deeper directory hierarchy is created dynamically when a prediction input file is stored.
   */
  predictionInputsPath: path.join(STORAGE_ROOT, "predictions"),
};
