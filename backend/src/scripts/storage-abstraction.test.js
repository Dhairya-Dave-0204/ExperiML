import fs from "fs/promises";
import path from "path";

import { storageConfig } from "#config/storage.config";
import { fileStorageService } from "#infra-services/storage/file-storage.service";

const runStorageAbstractionTest = async () => {
  try {
    console.log("🚀 Starting storage abstraction test...\n");

    /*
     * Step 1:
     * Create dummy file in temp storage
     */
    await fs.mkdir(storageConfig.tempPath, {
      recursive: true,
    });

    const tempFilePath = path.join(storageConfig.tempPath, "storage-test.csv");

    await fs.writeFile(tempFilePath, "name,age\nJohn,25\nAlice,30");

    console.log("✅ Temporary file created:", tempFilePath);

    /*
     * Step 2:
     * Verify file exists
     */
    const existsBeforeMove = await fileStorageService.exists(tempFilePath);

    console.log("✅ Exists before move:", existsBeforeMove);

    /*
     * Step 3:
     * Move to permanent storage
     */
    const permanentPath = await fileStorageService.moveToPermanent({
      tempFilePath,
      projectId: "test-project",
      datasetId: "test-dataset",
      extension: ".csv",
    });

    console.log("✅ Permanent path:", permanentPath);

    /*
     * Step 4:
     * Verify permanent file exists
     */
    const existsAfterMove = await fileStorageService.exists(permanentPath);

    console.log("✅ Exists after move:", existsAfterMove);

    /*
     * Step 5:
     * Delete file
     */
    await fileStorageService.delete(permanentPath);

    console.log("✅ Permanent file deleted");

    /*
     * Step 6:
     * Verify deletion
     */
    const existsAfterDelete = await fileStorageService.exists(permanentPath);

    console.log("✅ Exists after delete:", existsAfterDelete);

    console.log("\n🎉 Storage abstraction test completed successfully");
  } catch (error) {
    console.error("\n❌ Storage abstraction test failed:", error);

    process.exit(1);
  }
};

runStorageAbstractionTest();
