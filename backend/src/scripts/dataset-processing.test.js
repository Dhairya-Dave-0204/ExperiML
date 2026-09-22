import assert from "assert/strict";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

import datasetProcessingService from "#infra-services/dataset-processing/dataset-processing.service";
import { storageConfig } from "#config/storage.config";

const runProcessingTest = async () => {
  const projectId = crypto.randomUUID();
  const datasetId = crypto.randomUUID();
  const version = 1;

  const datasetDirectory = path.join(
    storageConfig.projectsPath,
    projectId,
    "datasets",
    datasetId,
  );

  const datasetFilePath = path.join(datasetDirectory, "data.csv");

  const storageKey = [
    "projects",
    projectId,
    "datasets",
    datasetId,
    "data.csv",
  ].join("/");

  try {
    console.log("🚀 Starting dataset processing abstraction test...\n");

    /*
     * 1. Create a test dataset in permanent dataset storage
     *
     * FastAPI resolves dataset storage keys relative to
     * the uploads root, so the physical file must exist
     * under:
     *
     * backend/uploads/projects/<projectId>/datasets/<datasetId>/
     */
    await fs.mkdir(datasetDirectory, {
      recursive: true,
    });

    const csvContent = "name,age\nJohn,25\nAlice,30";

    await fs.writeFile(datasetFilePath, csvContent);

    console.log("✅ Test dataset created:");
    console.log(datasetFilePath);

    /*
     * 2. Read file metadata
     */
    const fileStats = await fs.stat(datasetFilePath);

    const fileSize = fileStats.size;
    const mimeType = "text/csv";

    /*
     * 3. Generate SHA-256 checksum
     *
     * The checksum is generated from the exact file that
     * will be analyzed by FastAPI.
     */
    const fileBuffer = await fs.readFile(datasetFilePath);

    const checksum = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    console.log("✅ File metadata prepared");
    console.log("File size:", fileSize);
    console.log("MIME type:", mimeType);
    console.log("Checksum:", checksum);

    /*
     * 4. Analyze dataset through the application abstraction
     *
     * The service forwards the dataset reference to FastAPI:
     *
     * datasetId
     * version
     * storageKey
     * datasetFormat
     * fileSize
     * mimeType
     * checksum
     */
    const result = await datasetProcessingService.analyzeDataset({
      datasetId,
      version,
      filePath: datasetFilePath,
      storageKey,
      datasetFormat: "CSV",
      fileSize,
      mimeType,
      checksum,
    });

    /*
     * 5. Verify the returned analysis
     */
    assert.ok(result, "Dataset analysis result should exist");

    assert.equal(
      result.rowCount,
      2,
      "Dataset should contain exactly 2 data rows",
    );

    assert.equal(
      result.columnCount,
      2,
      "Dataset should contain exactly 2 columns",
    );

    assert.ok(result.metadata, "Dataset analysis should contain metadata");

    assert.equal(result.metadata.format, "CSV", "Dataset format should be CSV");

    assert.ok(
      Array.isArray(result.metadata.columns),
      "Dataset metadata should contain columns",
    );

    console.log("\n✅ Dataset analysis completed successfully");

    console.log("\nAnalysis result:");
    console.log(JSON.stringify(result, null, 2));

    console.log("\n🎉 Dataset processing abstraction test passed");
  } catch (error) {
    console.error("\n❌ Dataset processing failed");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error(
        "FastAPI response:",
        JSON.stringify(error.response.data, null, 2),
      );
    } else {
      console.error(error);
    }

    process.exit(1);
  } finally {
    /*
     * 6. Clean up the test dataset
     *
     * The test creates its own physical file, so it should
     * also remove it regardless of whether the test passes
     * or fails.
     */
    try {
      await fs.rm(datasetDirectory, {
        recursive: true,
        force: true,
      });

      console.log("\n🧹 Test dataset cleaned up");
    } catch (cleanupError) {
      console.error("⚠️ Failed to clean up test dataset:", cleanupError);
    }
  }
};

runProcessingTest();
