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

    console.log("✅ File exists after deletion:", deletedFileExists);

    console.log("\n🎉 Storage provider test completed successfully");
  } catch (error) {
    console.error("❌ Storage test failed:", error);

    process.exit(1);
  }
};

runStorageTest();
