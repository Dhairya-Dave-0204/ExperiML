import { fastApiClient } from "#clients/fastapi.client";

class FastApiProcessorService {
  async analyzeDataset({
    datasetId,
    version,
    storageKey,
    datasetFormat,
    fileSize,
    mimeType,
    checksum,
  }) {
    const response = await fastApiClient.post("/datasets/analyze", {
      dataset_id: datasetId,
      version,
      format: datasetFormat,
      storage_key: storageKey,
      file_size: fileSize,
      mime_type: mimeType,
      checksum,
    });

    const analysis = response.data;

    return {
      rowCount: analysis.row_count,
      columnCount: analysis.column_count,
      metadata: {
        format: analysis.format,
        duplicateRowCount: analysis.duplicate_row_count,
        duplicateRowPercentage: analysis.duplicate_row_percentage,
        columns: analysis.columns,
        statistics: analysis.statistics,
      },
    };
  }
}

export default FastApiProcessorService;