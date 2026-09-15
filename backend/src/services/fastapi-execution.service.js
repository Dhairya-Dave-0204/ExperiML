import { fastApiClient } from "#clients/fastapi.client";
import { fileStorageService } from "#infra-services/storage/file-storage.service";

class FastApiExecutionService {
  async createExecution({
    executionId,
    projectId,
    experimentId,
    dataset,
    problemType,
    algorithmName,
    configuration,
    hyperparameters,
  }) {
    const storageKey = fileStorageService.getStorageKey(dataset.filePath);

    const response = await fastApiClient.post("/executions", {
      execution_id: executionId,
      execution_type: "EXPERIMENT",

      project_id: projectId,
      experiment_id: experimentId,

      dataset: {
        id: dataset.id,
        version: dataset.datasetVersion,
        format: dataset.datasetFormat,
        storage_key: storageKey,
        file_size: Number(dataset.fileSize),
        mime_type: dataset.mimeType,
        checksum: dataset.checksum,
      },

      problem_type: problemType,

      algorithm: {
        name: algorithmName,
        configuration: {},
        hyperparameters: hyperparameters ?? {},
      },

      configuration: {
        target_column: configuration?.targetColumn,
        identifier_columns: configuration?.identifierColumns ?? [],
        datetime_columns: configuration?.datetimeColumns ?? [],
        remove_duplicates: configuration?.removeDuplicates ?? false,
      },
    });

    return {
      executionId: response.data.execution_id,
      status: response.data.status,
    };
  }

  async getExecution(executionId) {
    const response = await fastApiClient.get(
      `/executions/${executionId}`,
    );

    return response.data;
  }
}

export default new FastApiExecutionService();