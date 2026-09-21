import assert from "assert/strict";

import { fastApiClient } from "#clients/fastapi.client";
import { storageConfig } from "#config/storage.config";
import fastApiExecutionService from "#services/fastapi-execution.service";
import { fileStorageService } from "#infra-services/storage/file-storage.service";

async function main() {
  console.log("Starting FastAPI prediction execution service test...\n");

  const originalPost = fastApiClient.post;
  const originalGetStorageKeyFromRoot =
    fileStorageService.getStorageKeyFromRoot;

  try {
    /*
     * 1. Test data
     */
    const executionId = "execution-id";
    const projectId = "project-id";
    const experimentId = "experiment-id";
    const predictionId = "prediction-id";

    const inputFilePath =
      "D:\\VS Code\\ExperiML\\backend\\storage\\predictions\\projects\\project-id\\experiments\\experiment-id\\predictions\\prediction-id\\input.csv";

    const expectedStorageKey =
      "projects/project-id/experiments/experiment-id/predictions/prediction-id/input.csv";

    /*
     * 2. Mock generic storage-key generation
     *
     * We are testing FastApiExecutionService here,
     * so the storage provider itself does not need to
     * perform the path calculation again.
     */
    fileStorageService.getStorageKeyFromRoot = (filePath, rootPath) => {
      assert.equal(filePath, inputFilePath);
      assert.equal(rootPath, storageConfig.predictionInputsPath);

      return expectedStorageKey;
    };

    /*
     * 3. Mock FastAPI POST request
     *
     * Capture the exact payload sent by Node.
     */
    let capturedUrl = null;
    let capturedPayload = null;

    fastApiClient.post = async (url, payload) => {
      capturedUrl = url;
      capturedPayload = payload;

      return {
        data: {
          execution_id: executionId,
          status: "QUEUED",
        },
      };
    };

    /*
     * 4. Call prediction execution service
     */
    const result = await fastApiExecutionService.createPredictionExecution({
      executionId,
      projectId,
      experimentId,
      predictionId,
      predictionType: "SINGLE",

      input: {
        id: predictionId,
        filePath: inputFilePath,
        inputFormat: "CSV",
        fileSize: 128,
        mimeType: "text/csv",
        checksum: "input-checksum",
      },

      modelArtifact: {
        id: "model-artifact-id",
        storageKey:
          "projects/project-id/experiments/experiment-id/artifacts/model.joblib",
        fileFormat: "JOBLIB",
        checksum: "model-checksum",
      },

      preprocessingArtifact: {
        id: "preprocessing-artifact-id",
        storageKey:
          "projects/project-id/experiments/experiment-id/artifacts/preprocessing_pipeline.joblib",
        fileFormat: "JOBLIB",
        checksum: "preprocessing-checksum",
      },
    });

    /*
     * 5. Verify endpoint
     */
    assert.equal(capturedUrl, "/executions");

    console.log("✅ Correct FastAPI endpoint:", capturedUrl);

    /*
     * 6. Verify execution-level fields
     */
    assert.equal(capturedPayload.execution_id, executionId);

    assert.equal(capturedPayload.execution_type, "PREDICTION");

    assert.equal(capturedPayload.project_id, projectId);

    assert.equal(capturedPayload.experiment_id, experimentId);

    assert.equal(capturedPayload.prediction_id, predictionId);

    assert.equal(capturedPayload.prediction_type, "SINGLE");

    console.log("✅ Prediction execution fields are correct");

    /*
     * 7. Verify input reference
     */
    assert.deepEqual(capturedPayload.input, {
      id: predictionId,
      format: "CSV",
      storage_key: expectedStorageKey,
      file_size: 128,
      mime_type: "text/csv",
      checksum: "input-checksum",
    });

    console.log("✅ Prediction input reference is correct");

    /*
     * 8. Verify model artifact reference
     */
    assert.deepEqual(capturedPayload.model_artifact, {
      id: "model-artifact-id",
      storage_key:
        "projects/project-id/experiments/experiment-id/artifacts/model.joblib",
      file_format: "JOBLIB",
      checksum: "model-checksum",
    });

    console.log("✅ Model artifact reference is correct");

    /*
     * 9. Verify preprocessing artifact reference
     */
    assert.deepEqual(capturedPayload.preprocessing_artifact, {
      id: "preprocessing-artifact-id",
      storage_key:
        "projects/project-id/experiments/experiment-id/artifacts/preprocessing_pipeline.joblib",
      file_format: "JOBLIB",
      checksum: "preprocessing-checksum",
    });

    console.log("✅ Preprocessing artifact reference is correct");

    /*
     * 10. Verify service response mapping
     */
    assert.deepEqual(result, {
      executionId,
      status: "QUEUED",
    });

    console.log("✅ FastAPI response mapped correctly");

    /*
     * 11. Display final payload
     */
    console.log("\nFastAPI prediction execution payload:");

    console.log(JSON.stringify(capturedPayload, null, 2));

    console.log(
      "\n🎉 FastAPI prediction execution service test completed successfully",
    );
  } catch (error) {
    console.error("\n❌ FastAPI prediction execution service test failed.");

    console.error(error);

    process.exitCode = 1;
  } finally {
    /*
     * Restore original methods.
     */
    fastApiClient.post = originalPost;

    fileStorageService.getStorageKeyFromRoot = originalGetStorageKeyFromRoot;
  }
}

main();
