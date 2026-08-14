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

      const datasetId = crypto.randomUUID();

      const extension = this.getFileExtension(file.originalname);

      const datasetFormat = this.getDatasetFormat(extension);

      const datasetVersion = await this.generateDatasetVersion(projectId, name);

      const checksum = await generateFileChecksum(file.path);

      const metadata = await datasetProcessingService.analyzeDataset({
        filePath: file.path,

        datasetFormat,
      });

      permanentFilePath = await fileStorageService.moveToPermanent({
        tempFilePath: file.path,

        projectId,

        datasetId,

        extension,
      });

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
      if (file?.path) {
        await fileStorageService.delete(file.path);
      }

      if (permanentFilePath) {
        await fileStorageService.delete(permanentFilePath);
      }

      throw error;
    }
  }

  async getProjectDatasets({ projectId, userId }) {
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

    return prisma.dataset.findMany({
      where: {
        projectId,

        deletedAt: null,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getDatasetById({ projectId, datasetId, userId }) {
    const dataset = await prisma.dataset.findFirst({
      where: {
        id: datasetId,

        projectId,

        deletedAt: null,

        project: {
          userId,
        },
      },
    });

    if (!dataset) {
      throw new ApiError(404, "Dataset not found");
    }

    return dataset;
  }

  async getDatasetMetadata({ projectId, datasetId, userId }) {
    const dataset = await this.getDatasetById({
      projectId,

      datasetId,

      userId,
    });

    return {
      id: dataset.id,

      name: dataset.name,

      version: dataset.datasetVersion,

      format: dataset.datasetFormat,

      rowCount: dataset.rowCount,

      columnCount: dataset.columnCount,

      metadata: dataset.metadata,
    };
  }

  async updateDataset({ projectId, datasetId, userId, name }) {
    await this.getDatasetById({
      projectId,

      datasetId,

      userId,
    });

    return prisma.dataset.update({
      where: {
        id: datasetId,
      },

      data: {
        name,
      },
    });
  }

  async deleteDataset({ projectId, datasetId, userId }) {
    const dataset = await this.getDatasetById({
      projectId,

      datasetId,

      userId,
    });

    await prisma.dataset.update({
      where: {
        id: dataset.id,
      },

      data: {
        deletedAt: new Date(),
      },
    });

    /*
     * We intentionally do not delete
     * physical files immediately.
     *
     * Reason:
     * Experiments may reference
     * historical datasets.
     *
     * Cleanup can happen later
     * through a background process.
     */

    return true;
  }

  getFileExtension(filename) {
    return filename.slice(filename.lastIndexOf(".")).toLowerCase();
  }

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
