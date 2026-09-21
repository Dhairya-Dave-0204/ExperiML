import assert from "assert/strict";
import fs from "fs/promises";
import os from "os";
import path from "path";

import { prisma } from "#clients/prisma.client";
import { fileStorageService } from "#infra-services/storage/file-storage.service";
import fastApiExecutionService from "#services/fastapi-execution.service";

import { ARTIFACT_STATUS } from "#artifact/artifact.constants";
import { PREDICTION_STATUS } from "#prediction/prediction.constants";
import { createPrediction } from "#prediction/prediction.service";
import { generateFileChecksum } from "#utils/checksum.util";

const runPredictionChecksumTest = async () => {
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

  const calls = {
    predictionUpdates: [],
    predictionExecution: null,
  };

  let temporaryDirectory = null;

  try {
    console.log("🚀 Starting prediction service checksum test");

    /*
     * Use a real temporary directory for this test.
     *
     * This allows the real checksum utility to read
     * the actual stored input file.
     */
    temporaryDirectory = await fs.mkdtemp(
      path.join(os.tmpdir(), "experiml-prediction-checksum-"),
    );

    /*
     * Mock experiment ownership lookup.
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
    prisma.prediction.create = async ({ data }) => ({
      id: "prediction-id",
      ...data,
    });

    /*
     * Capture all prediction updates.
     */
    prisma.prediction.update = async ({ data }) => {
      calls.predictionUpdates.push(data);

      return {
        id: "prediction-id",
        ...data,
      };
    };

    /*
     * Return final prediction state.
     */
    prisma.prediction.findUnique = async () => ({
      id: "prediction-id",
      status: PREDICTION_STATUS.RUNNING,
    });

    /*
     * Mock model artifact.
     */
    prisma.artifact.findFirst = async ({ where }) => {
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
      await fs.mkdir(directoryPath, {
        recursive: true,
      });
    };

    /*
     * Mock file movement by actually writing the
     * prediction input file to the destination.
     */
    fileStorageService.moveFile = async ({ destinationPath }) => {
      await fs.writeFile(
        destinationPath,
        "feature_a,feature_b\n10,20\n",
        "utf8",
      );
    };

    /*
     * Mock FastAPI execution submission.
     *
     * We only want to inspect the payload here.
     */
    fastApiExecutionService.createPredictionExecution = async (payload) => {
      calls.predictionExecution = payload;

      return {
        executionId: payload.executionId,
        status: "QUEUED",
      };
    };

    const file = {
      originalname: "prediction-input.csv",
      path: "temp/prediction-input.csv",
      size: 128,
      mimetype: "text/csv",
    };

    await createPrediction({
      projectId: "project-id",
      experimentId: "experiment-id",
      userId: "user-id",
      data: {
        name: "Checksum Test Prediction",
        predictionType: "SINGLE",
      },
      file,
    });

    /*
     * Find the prediction update that persisted
     * the input checksum.
     */
    const inputUpdate = calls.predictionUpdates.find(
      (update) => update.checksum !== undefined,
    );

    assert.ok(inputUpdate, "Prediction checksum was not persisted");

    /*
     * Get the actual destination path from the
     * FastAPI request.
     */
    const storedInputPath = calls.predictionExecution.input.filePath;

    /*
     * Generate the expected checksum directly
     * from the actual stored file.
     */
    const expectedChecksum = await generateFileChecksum(storedInputPath);

    /*
     * Verify checksum persisted in Prediction.
     */
    assert.equal(inputUpdate.checksum, expectedChecksum);

    /*
     * Verify the SAME checksum was sent to FastAPI.
     */
    assert.equal(calls.predictionExecution.input.checksum, expectedChecksum);

    /*
     * Verify the checksum was not missing.
     */
    assert.ok(
      calls.predictionExecution.input.checksum,
      "FastAPI prediction input checksum is missing",
    );

    console.log("✅ Checksum generated from stored prediction input");

    console.log("✅ Checksum persisted to Prediction");

    console.log("✅ Same checksum passed to FastAPI");

    console.log(`🔐 Checksum: ${expectedChecksum}`);

    console.log("🎉 Prediction service checksum test completed successfully");
  } catch (error) {
    console.error("❌ Prediction service checksum test failed:", error);

    process.exitCode = 1;
  } finally {
    /*
     * Remove temporary test files.
     */
    if (temporaryDirectory) {
      try {
        await fs.rm(temporaryDirectory, {
          recursive: true,
          force: true,
        });
      } catch {
        // Ignore cleanup errors.
      }
    }

    /*
     * Restore Prisma mocks.
     */
    prisma.experiment.findFirst = originalExperimentFindFirst;

    prisma.prediction.findFirst = originalPredictionFindFirst;

    prisma.prediction.create = originalPredictionCreate;

    prisma.prediction.update = originalPredictionUpdate;

    prisma.prediction.findUnique = originalPredictionFindUnique;

    prisma.artifact.findFirst = originalArtifactFindFirst;

    /*
     * Restore storage mocks.
     */
    fileStorageService.ensureDirectory = originalEnsureDirectory;

    fileStorageService.moveFile = originalMoveFile;

    /*
     * Restore FastAPI mock.
     */
    fastApiExecutionService.createPredictionExecution =
      originalCreatePredictionExecution;
  }
};

runPredictionChecksumTest();
