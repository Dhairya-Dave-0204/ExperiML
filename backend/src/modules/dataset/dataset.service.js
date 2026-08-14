import crypto from "crypto";

import prisma from "#clients/prisma";

import { ApiError } from "#utils/ApiError";

import {
  DATASET_FORMATS,
  DATASET_STATUSES,
  ALLOWED_DATASET_EXTENSIONS,
} from "#dataset/dataset.constants";

import { generateFileChecksum } from "#utils/checksum.util";

import { fileStorageService } from "#infra-services/storage/file-storage.service";

import datasetProcessingService from "#infra-services/dataset-processing/dataset-processing.service";

class DatasetService {
  async createDataset({ projectId, userId, name, file }) {
    let permanentFilePath;

    try {
      /*
       * 1. Verify project ownership
       */
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,

          userId,

          deletedAt: null,
        },
      });

      if (!project) {
        throw new ApiError(404, "Project not found");
      }

      /*
       * 2. Generate dataset ID
       *
       * This same ID will be used for:
       *
       * - Storage directory
       * - Database primary key
       */
      const datasetId = crypto.randomUUID();

      /*
       * 3. Determine dataset format
       */
      const extension = this.getFileExtension(file.originalname);

      const datasetFormat = this.getDatasetFormat(extension);

      /*
       * 4. Generate dataset version
       */
      const datasetVersion = await this.generateDatasetVersion(projectId, name);

      /*
       * 5. Generate checksum
       */
      const checksum = await generateFileChecksum(file.path);

      /*
       * 6. Process dataset metadata
       */
      const metadata = await datasetProcessingService.analyzeDataset({
        filePath: file.path,

        datasetFormat,
      });

      /*
       * 7. Move file to permanent storage
       */
      permanentFilePath = await fileStorageService.moveToPermanent({
        tempFilePath: file.path,

        projectId,

        datasetId,

        extension,
      });

      /*
       * 8. Create database record
       */
      const dataset = await prisma.dataset.create({
        data: {
          id: datasetId,

          projectId,

          name,

          datasetVersion,

          originalFileName: file.originalname,

          filePath: permanentFilePath,

          fileSize: BigInt(file.size),

          mimeType: file.mimetype,

          checksum,

          datasetFormat,

          rowCount: metadata.rowCount,

          columnCount: metadata.columnCount,

          metadata: metadata.metadata,

          datasetStatus: DATASET_STATUSES.READY,
        },
      });

      return dataset;
    } catch (error) {
      /*
       * Cleanup temporary file
       */
      if (file?.path) {
        await fileStorageService.delete(file.path);
      }

      /*
       * Cleanup permanent file
       * if movement succeeded but DB failed
       */
      if (permanentFilePath) {
        await fileStorageService.delete(permanentFilePath);
      }

      throw error;
    }
  }

  /*
   * Extract extension from filename
   */
  getFileExtension(filename) {
    return filename.slice(filename.lastIndexOf(".")).toLowerCase();
  }

  /*
   * Convert extension into Prisma enum value
   */
  getDatasetFormat(extension) {
    switch (extension) {
      case ALLOWED_DATASET_EXTENSIONS.CSV:
        return DATASET_FORMATS.CSV;

      case ALLOWED_DATASET_EXTENSIONS.XLSX:
        return DATASET_FORMATS.XLSX;

      case ALLOWED_DATASET_EXTENSIONS.PARQUET:
        return DATASET_FORMATS.PARQUET;

      default:
        throw new ApiError(400, "Unsupported dataset format");
    }
  }

  /*
   * Backend-controlled version generation.
   *
   * Deleted versions are never reused.
   */
  async generateDatasetVersion(projectId, name) {
    const latestDataset = await prisma.dataset.findFirst({
      where: {
        projectId,

        name,
      },

      orderBy: {
        datasetVersion: "desc",
      },
    });

    return latestDataset ? latestDataset.datasetVersion + 1 : 1;
  }
}

export default new DatasetService();
