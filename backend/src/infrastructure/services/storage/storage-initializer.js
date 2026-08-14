import fs from "fs/promises";

import { storageConfig } from "#config/storage.config";

const initializeStorage = async () => {
  try {
    await fs.mkdir(storageConfig.rootPath, {
      recursive: true,
    });

    await fs.mkdir(storageConfig.tempPath, {
      recursive: true,
    });

    await fs.mkdir(storageConfig.projectsPath, {
      recursive: true,
    });

    console.log("Storage directories initialized successfully");
  } catch (error) {
    console.error("Failed to initialize storage directories", error);

    throw error;
  }
};

export { initializeStorage };
