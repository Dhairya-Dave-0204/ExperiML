import NodeParserService from "./node-parser.service.js";
import { env } from "#config/env.config";

let processor;

const PROCESSOR = env.DATASET_PROCESSOR || "node";

switch (PROCESSOR) {
  case "node":
    processor = new NodeParserService();

    break;

  case "fastapi":
    /*
     * Future implementation:
     *
     * processor = new FastApiProcessorService();
     *
     */

    throw new Error("FastAPI dataset processor is not implemented yet");

  default:
    throw new Error(`Unsupported dataset processor: ${PROCESSOR}`);
}

class DatasetProcessingService {
  /**
   * Analyze uploaded dataset.
   *
   * Input:
   * {
   *   filePath,
   *   storageKey,
   *   datasetFormat
   * }
   *
   * Output:
   * {
   *   rowCount,
   *   columnCount,
   *   metadata
   * }
   */
  async analyzeDataset({ filePath, storageKey, datasetFormat }) {
    return processor.analyzeDataset({
      filePath,
      storageKey,
      datasetFormat,
    });
  }
}

export default new DatasetProcessingService();
