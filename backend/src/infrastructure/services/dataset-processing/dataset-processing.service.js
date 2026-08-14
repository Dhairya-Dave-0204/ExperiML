import NodeParserService from "./node-parser.service.js";

let processor;

const PROCESSOR = process.env.DATASET_PROCESSOR || "node";

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
  async analyzeDataset({ filePath, datasetFormat }) {
    return processor.analyzeDataset({
      filePath,
      datasetFormat,
    });
  }
}

export default new DatasetProcessingService();
