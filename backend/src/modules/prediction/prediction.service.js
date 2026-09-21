import crypto from "crypto";
import path from "path";

import { prisma } from "#clients/prisma.client";
import { storageConfig } from "#config/storage.config";
import { fileStorageService } from "#infra-services/storage/file-storage.service";
import fastApiExecutionService from "#services/fastapi-execution.service";
import predictionExecutionPollerService from "#services/prediction-execution-poller.service";

import { ARTIFACT_STATUS } from "#artifact/artifact.constants";
import { PREDICTION_STATUS } from "#prediction/prediction.constants";

import { generateFileChecksum } from "#utils/checksum.util";

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
 * 2. Verify experiment is completed
 * 3. Check active prediction
 * 4. Create Prediction record
 * 5. Store input file
 * 6. Find model artifact
 * 7. Find preprocessing artifact
 * 8. Generate execution ID
 * 9. Trigger FastAPI prediction execution
 * 10. Move prediction to RUNNING
 */
const createPrediction = async ({
  projectId,
  experimentId,
  userId,
  data,
  file,
}) => {
  const experiment = await verifyExperimentOwnership({
    projectId,
    experimentId,
    userId,
  });

  /*
   * Prediction is only allowed against a completed experiment.
   */
  if (experiment.experimentStatus !== "COMPLETED") {
    throw new ApiError(
      400,
      "Prediction is only allowed for a completed experiment",
    );
  }

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

      predictionStatus: {
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

      predictionStatus: PREDICTION_STATUS.CREATED,
    },
  });

  /*
   * These values are needed both while storing the input
   * and later when building the FastAPI execution request.
   */
  let extension;
  let destinationPath;
  let checksum;

  try {
    /*
     * Prediction input storage:
     *
     * storage/
     *   predictions/
     *      projects/
     *          projectId/
     *              experiments/
     *                  experimentId/
     *                      predictions/
     *                          predictionId/
     *                              input.csv
     */
    const predictionDirectory = path.join(
      storageConfig.predictionInputsPath,
      "projects",
      projectId,
      "experiments",
      experimentId,
      "predictions",
      prediction.id,
    );

    await fileStorageService.ensureDirectory(predictionDirectory);

    extension = path.extname(file.originalname);

    destinationPath = path.join(predictionDirectory, `input${extension}`);

    await fileStorageService.moveFile({
      sourcePath: file.path,
      destinationPath,
    });

    checksum = await generateFileChecksum(destinationPath);

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

        checksum,
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
        predictionStatus: PREDICTION_STATUS.FAILED,
      },
    });

    throw new ApiError(500, "Failed to store prediction input file");
  }

  /*
   * Find the trained model artifact.
   */
  const modelArtifact = await prisma.artifact.findFirst({
    where: {
      experimentId,
      artifactType: "MODEL",
      artifactStatus: ARTIFACT_STATUS.AVAILABLE,
      deletedAt: null,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  if (!modelArtifact) {
    await prisma.prediction.update({
      where: {
        id: prediction.id,
      },

      data: {
        predictionStatus: PREDICTION_STATUS.FAILED,
      },
    });

    throw new ApiError(
      400,
      "Completed experiment does not have an available model artifact",
    );
  }

  /*
   * Find the fitted preprocessing pipeline artifact.
   */
  const preprocessingArtifact = await prisma.artifact.findFirst({
    where: {
      experimentId,
      artifactType: "PREPROCESSING_PIPELINE",
      artifactStatus: ARTIFACT_STATUS.AVAILABLE,
      deletedAt: null,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  if (!preprocessingArtifact) {
    await prisma.prediction.update({
      where: {
        id: prediction.id,
      },

      data: {
        predictionStatus: PREDICTION_STATUS.FAILED,
      },
    });

    throw new ApiError(
      400,
      "Completed experiment does not have an available preprocessing pipeline",
    );
  }

  /*
   * Generate the execution ID.
   *
   * FastAPI uses this ID to track the asynchronous
   * prediction execution.
   */
  const executionId = crypto.randomUUID();

  try {
    /*
     * Submit prediction execution to FastAPI.
     */
    await fastApiExecutionService.createPredictionExecution({
      executionId,
      projectId,
      experimentId,
      predictionId: prediction.id,
      predictionType: data.predictionType,

      input: {
        id: prediction.id,
        filePath: destinationPath,
        inputFormat: extension.replace(".", "").toUpperCase(),
        fileSize: BigInt(file.size),
        mimeType: file.mimetype,
        checksum,
      },

      modelArtifact: {
        id: modelArtifact.id,
        storageKey: modelArtifact.filePath,
        fileFormat: modelArtifact.fileFormat,
        checksum: modelArtifact.checksum,
      },

      preprocessingArtifact: {
        id: preprocessingArtifact.id,
        storageKey: preprocessingArtifact.filePath,
        fileFormat: preprocessingArtifact.fileFormat,
        checksum: preprocessingArtifact.checksum,
      },
    });

    /*
     * FastAPI accepted the execution.
     *
     * Node now owns the prediction lifecycle.
     */
    await prisma.prediction.update({
      where: {
        id: prediction.id,
      },

      data: {
        executionId,
        predictionStatus: PREDICTION_STATUS.RUNNING,
      },
    });

    predictionExecutionPollerService.start(executionId).catch((error) => {
      console.error(
        `Prediction execution polling failed for ${executionId}:`,
        error,
      );
    });
  } catch (error) {
    /*
     * FastAPI execution submission failed.
     */
    await prisma.prediction.update({
      where: {
        id: prediction.id,
      },

      data: {
        predictionStatus: PREDICTION_STATUS.FAILED,
      },
    });

    throw new ApiError(500, "Failed to start prediction execution");
  }

  /*
   * Return the latest prediction state.
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
      predictionStatus: status,

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
