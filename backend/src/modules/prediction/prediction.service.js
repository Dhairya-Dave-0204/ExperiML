import path from "path";

import { prisma } from "#clients/prisma.client";
import { storageConfig } from "#config/storage.config";
import { fileStorageService } from "#infra-services/storage/file-storage.service";

import { PREDICTION_STATUS } from "#prediction/prediction.constants";

import { ApiError } from "#utils/ApiError";

/*
 * Verify project and experiment relationship.
 * Ensures:
 * User
 *  |
 * Project
 *  |
 * Experiment
 */
const verifyExperimentOwnership = async ({
  projectId,
  experimentId,
  userId,
}) => {
  const experiment = await prisma.experiment.findFirst({
    where: {
      id: experimentId,

      project: {
        id: projectId,
        userId,
        deletedAt: null,
      },

      deletedAt: null,
    },
  });

  if (!experiment) {
    throw new ApiError(404, "Experiment not found");
  }

  return experiment;
};

/*
 * Create Prediction
 *
 * Flow:
 * 1. Verify ownership
 * 2. Check active prediction
 * 3. Create Prediction record
 * 4. Store input file
 * 5. Update input metadata
 *
 * FastAPI execution is not triggered yet.
 */
const createPrediction = async ({
  projectId,
  experimentId,
  userId,
  data,
  file,
}) => {
  await verifyExperimentOwnership({
    projectId,
    experimentId,
    userId,
  });

  if (!file) {
    throw new ApiError(400, "Prediction input file is required");
  }

  /*
   * Only one active prediction per experiment.
   *
   * Active states:
   * CREATED
   * RUNNING
   */
  const activePrediction = await prisma.prediction.findFirst({
    where: {
      experimentId,

      status: {
        in: [PREDICTION_STATUS.CREATED, PREDICTION_STATUS.RUNNING],
      },

      deletedAt: null,
    },
  });

  if (activePrediction) {
    throw new ApiError(
      409,
      "An active prediction already exists for this experiment",
    );
  }

  /*
   * Create prediction first.
   *
   * Prediction ID becomes the storage boundary.
   */
  const prediction = await prisma.prediction.create({
    data: {
      name: data.name,

      predictionType: data.predictionType,

      experimentId,

      status: PREDICTION_STATUS.CREATED,
    },
  });

  try {
    /*
     * Prediction input storage:
     * storage/
     *   predictions/
     *      projectId/
     *          experimentId/
     *              predictionId/
     *                  input.csv
     */
    const predictionDirectory = path.join(
      storageConfig.predictionInputsPath,
      projectId,
      experimentId,
      prediction.id,
    );

    await fileStorageService.ensureDirectory(predictionDirectory);

    const extension = path.extname(file.originalname);

    const destinationPath = path.join(predictionDirectory, `input${extension}`);

    await fileStorageService.moveFile({
      sourcePath: file.path,
      destinationPath,
    });

    await prisma.prediction.update({
      where: {
        id: prediction.id,
      },

      data: {
        inputFileName: file.originalname,

        inputFilePath: destinationPath,

        inputFormat: extension.replace(".", "").toUpperCase(),

        fileSize: BigInt(file.size),

        mimeType: file.mimetype,
      },
    });
  } catch (error) {
    /*
     * Storage failed.
     *
     * Prediction record exists, but execution cannot continue.
     */
    await prisma.prediction.update({
      where: {
        id: prediction.id,
      },

      data: {
        status: PREDICTION_STATUS.FAILED,
      },
    });

    throw new ApiError(500, "Failed to store prediction input file");
  }

  /*
   * Future:
   * Trigger FastAPI prediction execution here.
   *
   * Current state:
   * CREATED
   */
  return prisma.prediction.findUnique({
    where: {
      id: prediction.id,
    },
  });
};

/*
 * Get predictions for experiment
 */
const getPredictions = async ({ projectId, experimentId, userId }) => {
  await verifyExperimentOwnership({
    projectId,
    experimentId,
    userId,
  });

  return prisma.prediction.findMany({
    where: {
      experimentId,

      deletedAt: null,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

/*
 * Get single prediction
 */
const getPredictionById = async ({
  projectId,
  experimentId,
  predictionId,
  userId,
}) => {
  await verifyExperimentOwnership({
    projectId,
    experimentId,
    userId,
  });

  const prediction = await prisma.prediction.findFirst({
    where: {
      id: predictionId,

      experimentId,

      deletedAt: null,
    },
  });

  if (!prediction) {
    throw new ApiError(404, "Prediction not found");
  }

  return prediction;
};

/*
 * Internal lifecycle update.
 *
 * Used later by: 
 * - FastAPI integration
 * - background processing
 */
const updatePredictionStatus = async ({ predictionId, status, data = {} }) => {
  const prediction = await prisma.prediction.findUnique({
    where: {
      id: predictionId,
    },
  });

  if (!prediction) {
    throw new ApiError(404, "Prediction not found");
  }

  return prisma.prediction.update({
    where: {
      id: predictionId,
    },

    data: {
      status,

      ...data,
    },
  });
};

/*
 * Soft delete prediction
 */
const deletePrediction = async ({
  projectId,
  experimentId,
  predictionId,
  userId,
}) => {
  await verifyExperimentOwnership({
    projectId,
    experimentId,
    userId,
  });

  const prediction = await prisma.prediction.findFirst({
    where: {
      id: predictionId,

      experimentId,

      deletedAt: null,
    },
  });

  if (!prediction) {
    throw new ApiError(404, "Prediction not found");
  }

  return prisma.prediction.update({
    where: {
      id: predictionId,
    },

    data: {
      deletedAt: new Date(),
    },
  });
};

export {
  createPrediction,
  getPredictions,
  getPredictionById,
  updatePredictionStatus,
  deletePrediction,
};
