import path from "path";

import { prisma } from "#clients/prisma.client";
import { ApiError } from "#utils/ApiError";

import { fileStorageService } from "#infra-services/file-storage.service";

import { PREDICTION_STATUS } from "#prediction/prediction.constants";

/*
 * Verify project and experiment relationship.
 *
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
 * 5. Update metadata
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

  /*
   * Only one active prediction
   * per experiment.
   *
   * Active:
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
   * Prediction is created first.
   *
   * This gives us predictionId
   * which becomes the storage boundary.
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
    if (file) {
      const predictionDirectory = path.join(
        "predictions",
        projectId,
        experimentId,
        prediction.id,
      );

      /*
       * Physical storage path:
       * storage/predictions/projectId/experimentId/predictionId/input.csv
       */

      const destinationDirectory = path.join(predictionDirectory);

      await fileStorageService.ensureDirectory(
        path.join(
          fileStorageService.predictionInputsPath,
          destinationDirectory,
        ),
      );

      const extension = path.extname(file.originalname);

      const destinationPath = path.join(
        fileStorageService.predictionInputsPath,
        destinationDirectory,
        `input${extension}`,
      );

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
    }
  } catch (error) {
    /*
     * If storage fails,
     * prediction should not silently continue.
     */

    throw new ApiError(500, "Failed to store prediction input file");
  }

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
 * Used later by FastAPI integration.
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
