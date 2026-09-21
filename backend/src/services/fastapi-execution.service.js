import { fastApiClient } from "#clients/fastapi.client";
import { storageConfig } from "#config/storage.config";
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

  async createPredictionExecution({
    executionId,
    projectId,
    experimentId,
    predictionId,
    predictionType,
    input,
    modelArtifact,
    preprocessingArtifact,
  }) {
    const storageKey = fileStorageService.getStorageKeyFromRoot(
      input.filePath,
      storageConfig.predictionInputsPath,
    );

    const response = await fastApiClient.post("/executions", {
      execution_id: executionId,
      execution_type: "PREDICTION",

      project_id: projectId,
      experiment_id: experimentId,
      prediction_id: predictionId,
      prediction_type: predictionType,

      input: {
        id: input.id,
        format: input.inputFormat,
        storage_key: storageKey,
        file_size: Number(input.fileSize),
        mime_type: input.mimeType,
        checksum: input.checksum,
      },

      model_artifact: {
        id: modelArtifact.id,
        storage_key: modelArtifact.storageKey,
        file_format: modelArtifact.fileFormat,
        checksum: modelArtifact.checksum,
      },

      preprocessing_artifact: {
        id: preprocessingArtifact.id,
        storage_key: preprocessingArtifact.storageKey,
        file_format: preprocessingArtifact.fileFormat,
        checksum: preprocessingArtifact.checksum,
      },
    });

    return {
      executionId: response.data.execution_id,
      status: response.data.status,
    };
  }

  async getExecution(executionId) {
    const response = await fastApiClient.get(`/executions/${executionId}`);

    return response.data;
  }
}

export default new FastApiExecutionService();
