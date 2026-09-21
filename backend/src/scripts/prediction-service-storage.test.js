import assert from "assert/strict";
import path from "path";

import { prisma } from "#clients/prisma.client";
import { storageConfig } from "#config/storage.config";
import { fileStorageService } from "#infra-services/storage/file-storage.service";

import { PREDICTION_STATUS } from "#prediction/prediction.constants";
import { createPrediction } from "#prediction/prediction.service";

const runPredictionStorageTest = async () => {
  const originalExperimentFindFirst = prisma.experiment.findFirst;
  const originalPredictionFindFirst = prisma.prediction.findFirst;
  const originalPredictionCreate = prisma.prediction.create;
  const originalPredictionUpdate = prisma.prediction.update;
  const originalPredictionFindUnique = prisma.prediction.findUnique;

  const originalEnsureDirectory = fileStorageService.ensureDirectory;
  const originalMoveFile = fileStorageService.moveFile;

  const calls = {
    ensureDirectory: null,
    moveFile: null,
    predictionCreateData: null,
    predictionUpdateData: null,
  };

  try {
    console.log("🚀 Starting prediction service storage test");

    /*
     * Mock experiment ownership lookup.
     */
    prisma.experiment.findFirst = async () => ({
      id: "experiment-id",
      projectId: "project-id",
    });

    /*
     * No active prediction exists.
     */
    prisma.prediction.findFirst = async () => null;

    /*
     * Mock prediction creation.
     */
    prisma.prediction.create = async ({ data }) => {
      calls.predictionCreateData = data;

      return {
        id: "prediction-id",
        ...data,
      };
    };

    /*
     * Capture the updated input metadata.
     */
    prisma.prediction.update = async ({ data }) => {
      calls.predictionUpdateData = data;

      return {
        id: "prediction-id",
        ...data,
      };
    };

    /*
     * Return the final prediction.
     */
    prisma.prediction.findUnique = async () => ({
      id: "prediction-id",
      status: PREDICTION_STATUS.CREATED,
    });

    /*
     * Mock storage operations.
     *
     * We do not physically create/move a file here.
     * This test is specifically checking the path generated
     * by prediction.service.js.
     */
    fileStorageService.ensureDirectory = async (directoryPath) => {
      calls.ensureDirectory = directoryPath;
    };

    fileStorageService.moveFile = async ({
      sourcePath,
      destinationPath,
    }) => {
      calls.moveFile = {
        sourcePath,
        destinationPath,
      };
    };

    const file = {
      originalname: "prediction-input.csv",
      path: "temp/prediction-input.csv",
      size: 128,
      mimetype: "text/csv",
    };

    const result = await createPrediction({
      projectId: "project-id",
      experimentId: "experiment-id",
      userId: "user-id",
      data: {
        name: "Storage Test Prediction",
        predictionType: "SINGLE",
      },
      file,
    });

    /*
     * Expected physical prediction-input directory.
     */
    const expectedDirectory = path.join(
      storageConfig.predictionInputsPath,
      "projects",
      "project-id",
      "experiments",
      "experiment-id",
      "predictions",
      "prediction-id",
    );

    /*
     * Expected physical input file.
     */
    const expectedDestinationPath = path.join(
      expectedDirectory,
      "input.csv",
    );

    assert.equal(
      calls.ensureDirectory,
      expectedDirectory,
    );

    assert.deepEqual(calls.moveFile, {
      sourcePath: file.path,
      destinationPath: expectedDestinationPath,
    });

    assert.equal(
      calls.predictionCreateData.status,
      PREDICTION_STATUS.CREATED,
    );

    assert.equal(
      calls.predictionUpdateData.inputFileName,
      file.originalname,
    );

    assert.equal(
      calls.predictionUpdateData.inputFilePath,
      expectedDestinationPath,
    );

    assert.equal(
      calls.predictionUpdateData.inputFormat,
      "CSV",
    );

    assert.equal(
      calls.predictionUpdateData.fileSize,
      BigInt(file.size),
    );

    assert.equal(
      calls.predictionUpdateData.mimeType,
      file.mimetype,
    );

    assert.equal(
      result.id,
      "prediction-id",
    );

    console.log(
      "✅ Prediction input directory is correct:",
    );
    console.log(calls.ensureDirectory);

    console.log(
      "✅ Prediction input file path is correct:",
    );
    console.log(calls.moveFile.destinationPath);

    console.log(
      "🎉 Prediction service storage test completed successfully",
    );
  } catch (error) {
    console.error(
      "❌ Prediction service storage test failed:",
      error,
    );

    process.exitCode = 1;
  } finally {
    /*
     * Restore all mocked methods.
     */
    prisma.experiment.findFirst =
      originalExperimentFindFirst;

    prisma.prediction.findFirst =
      originalPredictionFindFirst;

    prisma.prediction.create =
      originalPredictionCreate;

    prisma.prediction.update =
      originalPredictionUpdate;

    prisma.prediction.findUnique =
      originalPredictionFindUnique;

    fileStorageService.ensureDirectory =
      originalEnsureDirectory;

    fileStorageService.moveFile =
      originalMoveFile;
  }
};

runPredictionStorageTest();