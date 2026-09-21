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
   * Save uploaded file into temporary storage. Currently Multer will handle writing the file.
   * This method is kept for future flexibility.
   */
  async saveTempFile(sourcePath, fileName) {
    await this.ensureDirectory(storageConfig.tempPath);

    const destinationPath = path.join(storageConfig.tempPath, fileName);

    await fs.rename(sourcePath, destinationPath);

    return destinationPath;
  }

  /**
   * Move processed dataset file from temp storage to permanent upload storage.
   *
   * Structure:
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

  getStorageKeyFromRoot(filePath, rootPath) {
    const relativePath = path.relative(rootPath, filePath);

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      throw new Error("File path is outside the storage root");
    }

    return relativePath.split(path.sep).join("/");
  }

  /**
   * Convert an absolute dataset file path into a provider-independent storage key.
   *
   * Example:
   * backend/uploads/projects/projectId/datasets/datasetId/data.csv
   *
   * becomes:
   * projects/projectId/datasets/datasetId/data.csv
   *
   * This method is specifically for uploaded datasets.
   */
  getStorageKey(filePath) {
    const relativePath = this.getStorageKeyFromRoot(
      filePath,
      storageConfig.projectsPath,
    );

    return path.join("projects", relativePath).split(path.sep).join("/");
  }

  /**
   * Resolve a provider-independent storage key against a specific storage root.
   *
   * The root determines the storage namespace:
   * uploads:
   *   backend/uploads/projects/...
   *
   * system storage:
   *   backend/storage/artifacts/...
   *   backend/storage/predictions/...
   *
   * The storage key itself remains provider-independent.
   */
  resolveStoragePath(storageKey, rootPath) {
    const resolvedRoot = path.resolve(rootPath);
    const resolvedPath = path.resolve(resolvedRoot, storageKey);

    if (
      resolvedPath !== resolvedRoot &&
      !resolvedPath.startsWith(`${resolvedRoot}${path.sep}`)
    ) {
      throw new Error("Storage key points outside the storage root");
    }

    return resolvedPath;
  }

  /**
   * Generic file movement.
   *
   * Used by:
   * - prediction input storage
   * - future generic storage operations
   *
   * The provider does not know:
   * - artifact
   * - prediction
   * - dataset
   *
   * It only moves files.
   */
  async moveFile({ sourcePath, destinationPath }) {
    const destinationDirectory = path.dirname(destinationPath);

    await this.ensureDirectory(destinationDirectory);

    await fs.rename(sourcePath, destinationPath);

    return destinationPath;
  }

  /**
   * Create a readable stream for a physical file path.
   *
   * Used by:
   * - artifact download
   * - future file streaming operations
   *
   * The provider does not handle HTTP response.
   */
  createReadStream(filePath) {
    return createReadStream(filePath);
  }

  /**
   * Delete a physical file.
   */
  async delete(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      /*
       * Ignore missing files.
       *
       * Example: cleanup already performed.
       */
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  /**
   * Check whether a physical file exists.
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
