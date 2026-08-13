import { storageConfig } from "#config/storage.config";

import LocalStorageProvider from "./local-storage.provider.js";
import CloudinaryProvider from "./cloudinary.provider.js";

let storageProvider;

switch (storageConfig.provider) {
  case "local":
    storageProvider = new LocalStorageProvider();

    break;

  case "cloudinary":
    storageProvider = new CloudinaryProvider();

    break;

  default:
    throw new Error(`Unsupported storage provider: ${storageConfig.provider}`);
}

export const fileStorageService = storageProvider;
