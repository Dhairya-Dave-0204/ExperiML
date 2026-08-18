import { createReadStream } from "fs";
import fs from "fs/promises";
import path from "path";

import { storageConfig } from "#config/storage.config";

class LocalStorageProvider {
  /**
   * Ensure a directory exists.
   */
  async ensureDirectory(directoryPath) {
    await fs.mkdir(directoryPath, {
      recursive: true,
    });
  }

  /**
   * Save uploaded file into temporary storage.
   *
   * Currently Multer will handle writing the file.
   * This method is kept for future flexibility.
   */
  async saveTempFile(sourcePath, fileName) {
    await this.ensureDirectory(storageConfig.tempPath);

    const destinationPath = path.join(storageConfig.tempPath, fileName);

    await fs.rename(sourcePath, destinationPath);

    return destinationPath;
  }

  /**
   * Move processed dataset file
   * from temp storage to permanent storage.
   *
   * Structure:
   *
   * uploads/
   *   projects/
   *      projectId/
   *          datasets/
   *              datasetId/
   *                  data.csv
   */
  async moveToPermanent({ tempFilePath, projectId, datasetId, extension }) {
    const datasetDirectory = path.join(
      storageConfig.projectsPath,
      projectId,
      "datasets",
      datasetId,
    );

    await this.ensureDirectory(datasetDirectory);

    const finalFilePath = path.join(datasetDirectory, `data${extension}`);

    await fs.rename(tempFilePath, finalFilePath);

    return finalFilePath;
  }

  /**
   * Create a readable stream for a stored file.
   *
   * Used by:
   * - artifact download
   * - future file streaming operations
   *
   * The provider does not handle the HTTP response.
   * It only provides access to the stored file as a stream.
   */
  createReadStream(filePath) {
    return createReadStream(filePath);
  }

  /**
   * Delete a file.
   *
   * Used during:
   * - processing failure
   * - cleanup
   */
  async delete(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      /*
       * Ignore missing files.
       *
       * Example:
       * cleanup already performed.
       */
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  /**
   * Check whether a file exists.
   */
  async exists(filePath) {
    try {
      await fs.access(filePath);

      return true;
    } catch {
      return false;
    }
  }
}

export default LocalStorageProvider;
