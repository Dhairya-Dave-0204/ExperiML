import fs from "fs/promises";

import { storageConfig } from "#config/storage.config";

const initializeStorage = async () => {
  try {
    /*
     * User uploaded files storage
     *
     * backend/uploads/
     */
    await fs.mkdir(storageConfig.rootPath, {
      recursive: true,
    });

    /*
     * Temporary upload location
     *
     * backend/uploads/temp/
     */
    await fs.mkdir(storageConfig.tempPath, {
      recursive: true,
    });

    /*
     * Dataset permanent storage
     *
     * backend/uploads/projects/
     */
    await fs.mkdir(storageConfig.projectsPath, {
      recursive: true,
    });

    /*
     * System generated artifacts storage
     *
     * backend/storage/artifacts/
     */
    await fs.mkdir(storageConfig.artifactsPath, {
      recursive: true,
    });

    /*
     * Prediction input storage
     *
     * backend/storage/predictions/
     *
     * Deeper structure:
     *
     * predictions/
     *   <projectId>/
     *      <experimentId>/
     *          <predictionId>/
     *
     * is created dynamically when a prediction input is stored.
     */
    await fs.mkdir(storageConfig.predictionInputsPath, {
      recursive: true,
    });

    console.log("Storage directories initialized successfully");
  } catch (error) {
    console.error("Failed to initialize storage directories", error);

    throw error;
  }
};

export { initializeStorage };
