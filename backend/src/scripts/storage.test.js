import assert from "assert/strict";
import fs from "fs/promises";
import path from "path";

import LocalStorageProvider from "#infra-services/storage/local-storage.provider";
import { storageConfig } from "#config/storage.config";

const storage = new LocalStorageProvider();

const runStorageTest = async () => {
  try {
    console.log("🚀 Starting storage provider test");

    /*
     * 1. Create a dummy temporary file
     */
    const dummyDirectory = storageConfig.tempPath;

    await fs.mkdir(dummyDirectory, {
      recursive: true,
    });

    const tempFilePath = path.join(dummyDirectory, "test-dataset.csv");

    await fs.writeFile(tempFilePath, "name,age\nJohn,25\nAlice,30");

    console.log("✅ Temporary file created:", tempFilePath);

    /*
     * 2. Check file exists
     */
    const exists = await storage.exists(tempFilePath);

    assert.equal(exists, true);

    console.log("✅ File exists:", exists);

    /*
     * 3. Move to permanent storage
     */
    const permanentPath = await storage.moveToPermanent({
      tempFilePath,
      projectId: "test-project-id",
      datasetId: "test-dataset-id",
      extension: ".csv",
    });

    console.log("✅ File moved to:", permanentPath);

    /*
     * 4. Verify new location
     */
    const movedFileExists = await storage.exists(permanentPath);

    assert.equal(movedFileExists, true);

    console.log("✅ Permanent file exists:", movedFileExists);

    /*
     * 5. Delete file
     */
    await storage.delete(permanentPath);

    console.log("✅ File deleted");

    /*
     * 6. Verify deletion
     */
    const deletedFileExists = await storage.exists(permanentPath);

    assert.equal(deletedFileExists, false);

    console.log("✅ File exists after deletion:", deletedFileExists);

    /*
     * 7. Test artifact storage-key resolution
     *
     * The storage key is provider-independent.
     * The root determines the physical storage namespace.
     */
    const artifactStorageKey =
      "projects/test-project/experiments/test-experiment/artifacts/model.joblib";

    const resolvedArtifactPath = storage.resolveStoragePath(
      artifactStorageKey,
      storageConfig.artifactsPath,
    );

    const expectedArtifactPath = path.join(
      storageConfig.artifactsPath,
      "projects",
      "test-project",
      "experiments",
      "test-experiment",
      "artifacts",
      "model.joblib",
    );

    assert.equal(resolvedArtifactPath, expectedArtifactPath);

    console.log(
      "✅ Artifact storage key resolved correctly:",
      resolvedArtifactPath,
    );

    /*
     * 8. Test prediction storage-key resolution
     */
    const predictionStorageKey =
      "projects/test-project/experiments/test-experiment/predictions/input.csv";

    const resolvedPredictionPath = storage.resolveStoragePath(
      predictionStorageKey,
      storageConfig.predictionInputsPath,
    );

    const expectedPredictionPath = path.join(
      storageConfig.predictionInputsPath,
      "projects",
      "test-project",
      "experiments",
      "test-experiment",
      "predictions",
      "input.csv",
    );

    assert.equal(resolvedPredictionPath, expectedPredictionPath);

    console.log(
      "✅ Prediction storage key resolved correctly:",
      resolvedPredictionPath,
    );

    /*
     * 9. Test generic storage-key generation
     *
     * The storage provider should generate a
     * provider-independent key from any storage root.
     */

    /*
     * 9a. Prediction input storage key
     */
    const predictionInputPath = path.join(
      storageConfig.predictionInputsPath,
      "projects",
      "test-project",
      "experiments",
      "test-experiment",
      "predictions",
      "test-prediction",
      "input.csv",
    );

    const predictionInputStorageKey = storage.getStorageKeyFromRoot(
      predictionInputPath,
      storageConfig.predictionInputsPath,
    );

    const expectedPredictionInputStorageKey =
      "projects/test-project/experiments/test-experiment/predictions/test-prediction/input.csv";

    assert.equal(predictionInputStorageKey, expectedPredictionInputStorageKey);

    console.log(
      "✅ Generic prediction storage key generated correctly:",
      predictionInputStorageKey,
    );

    /*
     * 9b. Artifact storage key
     */
    const artifactPath = path.join(
      storageConfig.artifactsPath,
      "projects",
      "test-project",
      "experiments",
      "test-experiment",
      "artifacts",
      "model.joblib",
    );

    const artifactStorageKeyFromRoot = storage.getStorageKeyFromRoot(
      artifactPath,
      storageConfig.artifactsPath,
    );

    const expectedArtifactStorageKeyFromRoot =
      "projects/test-project/experiments/test-experiment/artifacts/model.joblib";

    assert.equal(
      artifactStorageKeyFromRoot,
      expectedArtifactStorageKeyFromRoot,
    );

    console.log(
      "✅ Generic artifact storage key generated correctly:",
      artifactStorageKeyFromRoot,
    );

    /*
     * 10. Test storage-root traversal protection
     */
    assert.throws(
      () =>
        storage.resolveStoragePath(
          "../../outside.txt",
          storageConfig.artifactsPath,
        ),
      {
        message: "Storage key points outside the storage root",
      },
    );

    console.log("✅ Storage path traversal correctly rejected");

    console.log("\n🎉 Storage provider test completed successfully");
  } catch (error) {
    console.error("❌ Storage test failed:", error);

    process.exit(1);
  }
};

runStorageTest();
