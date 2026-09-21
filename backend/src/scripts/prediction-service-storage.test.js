import assert from "assert/strict";
import fs from "fs/promises";
import path from "path";

import { prisma } from "#clients/prisma.client";
import { storageConfig } from "#config/storage.config";
import { fileStorageService } from "#infra-services/storage/file-storage.service";
import fastApiExecutionService from "#services/fastapi-execution.service";
import predictionExecutionPollerService from "#services/prediction-execution-poller.service";

import { ARTIFACT_STATUS } from "#artifact/artifact.constants";
import { PREDICTION_STATUS } from "#prediction/prediction.constants";
import { createPrediction } from "#prediction/prediction.service";
import { generateFileChecksum } from "#utils/checksum.util";

const runPredictionStorageTest = async () => {
  const originalExperimentFindFirst = prisma.experiment.findFirst;

  const originalPredictionFindFirst = prisma.prediction.findFirst;

  const originalPredictionCreate = prisma.prediction.create;

  const originalPredictionUpdate = prisma.prediction.update;

  const originalPredictionFindUnique = prisma.prediction.findUnique;

  const originalArtifactFindFirst = prisma.artifact.findFirst;

  const originalEnsureDirectory = fileStorageService.ensureDirectory;

  const originalMoveFile = fileStorageService.moveFile;

  const originalCreatePredictionExecution =
    fastApiExecutionService.createPredictionExecution;

  const originalPredictionPollerStart =
    predictionExecutionPollerService.start;

  const calls = {
    ensureDirectory: null,
    moveFile: null,
    predictionCreateData: null,
    predictionUpdates: [],
    artifactFindFirst: [],
    predictionExecution: null,
  };

  let destinationPath = null;

  try {
    console.log("🚀 Starting prediction service storage test");

    /*
     * Mock experiment ownership lookup.
     *
     * Prediction execution is only allowed for
     * completed experiments.
     */
    prisma.experiment.findFirst = async () => ({
      id: "experiment-id",
      projectId: "project-id",
      experimentStatus: "COMPLETED",
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
     * Capture every prediction update.
     *
     * createPrediction() performs more than one update:
     *
     * 1. Store input metadata + checksum
     * 2. Set executionId + RUNNING
     */
    prisma.prediction.update = async ({ data }) => {
      calls.predictionUpdates.push(data);

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
      status: PREDICTION_STATUS.RUNNING,
    });

    /*
     * Mock artifact lookup.
     *
     * The first call is for the MODEL artifact.
     * The second call is for the PREPROCESSING_PIPELINE artifact.
     */
    prisma.artifact.findFirst = async ({ where }) => {
      calls.artifactFindFirst.push(where);

      if (where.artifactType === "MODEL") {
        return {
          id: "model-artifact-id",
          experimentId: "experiment-id",
          artifactType: "MODEL",
          artifactStatus: ARTIFACT_STATUS.AVAILABLE,
          filePath:
            "projects/project-id/experiments/experiment-id/artifacts/model.joblib",
          fileFormat: "JOBLIB",
          checksum: "model-checksum",
        };
      }

      if (where.artifactType === "PREPROCESSING_PIPELINE") {
        return {
          id: "preprocessing-artifact-id",
          experimentId: "experiment-id",
          artifactType: "PREPROCESSING_PIPELINE",
          artifactStatus: ARTIFACT_STATUS.AVAILABLE,
          filePath:
            "projects/project-id/experiments/experiment-id/artifacts/preprocessing_pipeline.joblib",
          fileFormat: "JOBLIB",
          checksum: "preprocessing-checksum",
        };
      }

      return null;
    };

    /*
     * Mock directory creation.
     */
    fileStorageService.ensureDirectory = async (directoryPath) => {
      calls.ensureDirectory = directoryPath;

      await fs.mkdir(directoryPath, {
        recursive: true,
      });
    };

    /*
     * Mock file move.
     *
     * Unlike the old test, we need to create a real
     * destination file because generateFileChecksum()
     * reads the stored file from disk.
     */
    fileStorageService.moveFile = async ({
      sourcePath,
      destinationPath: targetPath,
    }) => {
      calls.moveFile = {
        sourcePath,
        destinationPath: targetPath,
      };

      destinationPath = targetPath;

      await fs.writeFile(targetPath, "id,name\n1,test-input\n", "utf8");
    };

    /*
     * Mock FastAPI execution submission.
     *
     * This test is not supposed to contact FastAPI.
     * We only need to verify that the prediction service
     * prepares the execution correctly.
     */
    fastApiExecutionService.createPredictionExecution = async (payload) => {
      calls.predictionExecution = payload;

      return {
        executionId: payload.executionId,
        status: "QUEUED",
      };
    };

    /*
     * Mock the prediction execution poller.
     *
     * The storage test is not responsible for testing
     * polling behavior. The poller has its own dedicated test.
     *
     * Without this mock, createPrediction() would start the
     * real poller and it would attempt to contact FastAPI.
     */
    predictionExecutionPollerService.start = async () => {};

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

    /*
     * Verify directory path.
     */
    assert.equal(calls.ensureDirectory, expectedDirectory);

    /*
     * Verify file move destination.
     */
    assert.deepEqual(calls.moveFile, {
      sourcePath: file.path,
      destinationPath: expectedDestinationPath,
    });

    /*
     * Verify prediction creation.
     */
    assert.equal(
      calls.predictionCreateData.status,
      PREDICTION_STATUS.CREATED,
    );

    /*
     * Find the update that stored the input metadata.
     */
    const inputMetadataUpdate = calls.predictionUpdates.find(
      (update) => update.inputFilePath === expectedDestinationPath,
    );

    assert.ok(
      inputMetadataUpdate,
      "Prediction input metadata update was not found",
    );

    /*
     * Verify stored input metadata.
     */
    assert.equal(
      inputMetadataUpdate.inputFileName,
      file.originalname,
    );

    assert.equal(
      inputMetadataUpdate.inputFilePath,
      expectedDestinationPath,
    );

    assert.equal(inputMetadataUpdate.inputFormat, "CSV");

    assert.equal(
      inputMetadataUpdate.fileSize,
      BigInt(file.size),
    );

    assert.equal(
      inputMetadataUpdate.mimeType,
      file.mimetype,
    );

    /*
     * Verify the checksum generated from the actual
     * stored file.
     */
    const expectedChecksum = await generateFileChecksum(
      expectedDestinationPath,
    );

    assert.equal(
      inputMetadataUpdate.checksum,
      expectedChecksum,
    );

    /*
     * Verify the same checksum is passed to FastAPI.
     */
    assert.equal(
      calls.predictionExecution.input.checksum,
      expectedChecksum,
    );

    /*
     * Verify the prediction execution received
     * the correct input reference.
     */
    assert.equal(
      calls.predictionExecution.input.id,
      "prediction-id",
    );

    assert.equal(
      calls.predictionExecution.input.filePath,
      expectedDestinationPath,
    );

    assert.equal(
      calls.predictionExecution.input.inputFormat,
      "CSV",
    );

    /*
     * Verify artifact references.
     */
    assert.equal(
      calls.predictionExecution.modelArtifact.id,
      "model-artifact-id",
    );

    assert.equal(
      calls.predictionExecution.preprocessingArtifact.id,
      "preprocessing-artifact-id",
    );

    /*
     * Verify final prediction state.
     */
    assert.equal(
      result.id,
      "prediction-id",
    );

    assert.equal(
      result.status,
      PREDICTION_STATUS.RUNNING,
    );

    console.log("✅ Prediction input directory is correct:");
    console.log(calls.ensureDirectory);

    console.log("✅ Prediction input file path is correct:");
    console.log(calls.moveFile.destinationPath);

    console.log("✅ Prediction input checksum is correct:");
    console.log(expectedChecksum);

    console.log("✅ Prediction checksum passed correctly to FastAPI");

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
     * Clean up the test-created file.
     */
    if (destinationPath) {
      try {
        await fs.rm(destinationPath, {
          force: true,
        });
      } catch {
        // Ignore cleanup errors.
      }
    }

    /*
     * Restore all mocked methods.
     */
    prisma.experiment.findFirst = originalExperimentFindFirst;

    prisma.prediction.findFirst = originalPredictionFindFirst;

    prisma.prediction.create = originalPredictionCreate;

    prisma.prediction.update = originalPredictionUpdate;

    prisma.prediction.findUnique = originalPredictionFindUnique;

    prisma.artifact.findFirst = originalArtifactFindFirst;

    fileStorageService.ensureDirectory = originalEnsureDirectory;

    fileStorageService.moveFile = originalMoveFile;

    fastApiExecutionService.createPredictionExecution =
      originalCreatePredictionExecution;

    predictionExecutionPollerService.start =
      originalPredictionPollerStart;
  }
};

runPredictionStorageTest();