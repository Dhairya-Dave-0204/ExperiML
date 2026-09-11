import NodeParserService from "./node-parser.service.js";
import FastApiProcessorService from "./fastapi-processor.service.js";
import { env } from "#config/env.config";

let processor;

const PROCESSOR = env.DATASET_PROCESSOR || "node";

switch (PROCESSOR) {
  case "node":
    processor = new NodeParserService();
    break;

  case "fastapi":
    processor = new FastApiProcessorService();
    break;

  default:
    throw new Error(`Unsupported dataset processor: ${PROCESSOR}`);
}

class DatasetProcessingService {
  /**
   * Analyze uploaded dataset.
   *
   * Input:
   * {
   *   datasetId,
   *   version,
   *   filePath,
   *   storageKey,
   *   datasetFormat,
   *   fileSize,
   *   mimeType,
   *   checksum
   * }
   *
   * Output:
   * {
   *   rowCount,
   *   columnCount,
   *   metadata
   * }
   */
  async analyzeDataset({
    datasetId,
    version,
    filePath,
    storageKey,
    datasetFormat,
    fileSize,
    mimeType,
    checksum,
  }) {
    return processor.analyzeDataset({
      datasetId,
      version,
      filePath,
      storageKey,
      datasetFormat,
      fileSize,
      mimeType,
      checksum,
    });
  }
}

export default DatasetProcessingService;