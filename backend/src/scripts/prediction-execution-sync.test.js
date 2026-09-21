import assert from "assert";

import { prisma } from "#clients/prisma.client";
import fastApiExecutionService from "#services/fastapi-execution.service";
import artifactService from "#artifact/artifact.service";

import predictionExecutionSyncService from "#services/prediction-execution-sync.service";

const run = async () => {
  const prediction = {
    id: "prediction-1",
    experimentId: "experiment-1",
    executionId: "execution-1",
    predictionStatus: "RUNNING",
  };

  // --------------------------------------------------
  // RUNNING
  // --------------------------------------------------

  fastApiExecutionService.getExecution = async () => ({
    execution_id: "execution-1",
    status: "RUNNING",
    started_at: "2026-09-21T10:00:00.000Z",
    completed_at: null,
    result: null,
    error: null,
  });

  prisma.prediction.findUnique = async () => prediction;

  let runningUpdate;

  prisma.prediction.update = async ({ data }) => {
    runningUpdate = data;

    return {
      ...prediction,
      ...data,
    };
  };

  const runningResult =
    await predictionExecutionSyncService.synchronize("execution-1");

  assert.strictEqual(runningUpdate.predictionStatus, "RUNNING");

  assert.strictEqual(
    runningUpdate.startedAt.toISOString(),
    "2026-09-21T10:00:00.000Z",
  );

  assert.strictEqual(runningResult.prediction.predictionStatus, "RUNNING");

  // --------------------------------------------------
  // QUEUED while Node prediction is already RUNNING
  // --------------------------------------------------

  fastApiExecutionService.getExecution = async () => ({
    execution_id: "execution-1",
    status: "QUEUED",
    started_at: null,
    completed_at: null,
    result: null,
    error: null,
  });

  let queuedUpdate;

  prisma.prediction.findUnique = async () => ({
    ...prediction,
    predictionStatus: "RUNNING",
  });

  prisma.prediction.update = async ({ data }) => {
    queuedUpdate = data;

    return {
      ...prediction,
      ...data,
    };
  };

  const queuedResult =
    await predictionExecutionSyncService.synchronize("execution-1");

  assert.strictEqual(queuedUpdate.predictionStatus, "RUNNING");

  assert.strictEqual(queuedResult.prediction.predictionStatus, "RUNNING");

  // --------------------------------------------------
  // SUCCEEDED
  // --------------------------------------------------

  fastApiExecutionService.getExecution = async () => ({
    execution_id: "execution-1",
    status: "SUCCEEDED",
    started_at: "2026-09-21T10:00:00.000Z",
    completed_at: "2026-09-21T10:00:05.000Z",
    result: {
      artifacts: [
        {
          artifact_name: "prediction-output",
          artifact_type: "PREDICTION_EXPORT",
          file_format: "CSV",
          original_file_name: "prediction.csv",
          storage_key:
            "projects/project-1/experiments/experiment-1/artifacts/predictions/prediction-1/prediction.csv",
          file_size: 1024,
          mime_type: "text/csv",
          checksum: "abc123",
          metadata: {
            rows_processed: 1,
          },
        },
      ],
      metadata: {
        rows_processed: 1,
      },
    },
    error: null,
  });

  artifactService.createFromExecutionResult = async ({
    experimentId,
    artifact,
  }) => ({
    id: "artifact-1",
    experimentId,
    artifactName: artifact.artifact_name,
  });

  prisma.artifact.findFirst = async () => null;

  let completedUpdate;

  prisma.prediction.findUnique = async () => ({
    ...prediction,
    predictionStatus: "RUNNING",
  });

  prisma.prediction.update = async ({ data }) => {
    completedUpdate = data;

    return {
      ...prediction,
      ...data,
    };
  };

  const completedResult =
    await predictionExecutionSyncService.synchronize("execution-1");

  assert.strictEqual(completedUpdate.predictionStatus, "COMPLETED");

  assert.strictEqual(completedUpdate.outputArtifactId, "artifact-1");

  assert.strictEqual(completedUpdate.rowsProcessed, 1);

  assert.deepStrictEqual(completedUpdate.metadata, {
    rows_processed: 1,
  });

  assert.strictEqual(
    completedUpdate.completedAt.toISOString(),
    "2026-09-21T10:00:05.000Z",
  );

  assert.strictEqual(completedResult.prediction.predictionStatus, "COMPLETED");

  // --------------------------------------------------
  // FAILED
  // --------------------------------------------------

  fastApiExecutionService.getExecution = async () => ({
    execution_id: "execution-1",
    status: "FAILED",
    started_at: "2026-09-21T10:00:00.000Z",
    completed_at: "2026-09-21T10:00:03.000Z",
    result: null,
    error: {
      code: "EXECUTION_FAILED",
      message: "Prediction failed",
      stage: "INFERENCE",
    },
  });

  let failedUpdate;

  prisma.prediction.findUnique = async () => ({
    ...prediction,
    predictionStatus: "RUNNING",
  });

  prisma.prediction.update = async ({ data }) => {
    failedUpdate = data;

    return {
      ...prediction,
      ...data,
    };
  };

  const failedResult =
    await predictionExecutionSyncService.synchronize("execution-1");

  assert.strictEqual(failedUpdate.predictionStatus, "FAILED");

  assert.strictEqual(
    failedUpdate.completedAt.toISOString(),
    "2026-09-21T10:00:03.000Z",
  );

  assert.strictEqual(failedResult.prediction.predictionStatus, "FAILED");

  // --------------------------------------------------
  // Missing prediction
  // --------------------------------------------------

  prisma.prediction.findUnique = async () => null;

  let missingPredictionError = null;

  try {
    await predictionExecutionSyncService.synchronize("missing-execution");
  } catch (error) {
    missingPredictionError = error;
  }

  assert.ok(missingPredictionError);

  assert.match(
    missingPredictionError.message,
    /Prediction not found for execution/,
  );

  console.log("Prediction execution sync tests passed.");
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
