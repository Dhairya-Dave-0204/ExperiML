import { prisma } from "#clients/prisma.client";
import fastApiExecutionService from "#services/fastapi-execution.service";
import artifactService from "#artifact/artifact.service";

import { PREDICTION_STATUS } from "#prediction/prediction.constants";

class PredictionExecutionSyncService {
  async synchronize(executionId) {
    const execution = await fastApiExecutionService.getExecution(executionId);

    const prediction = await prisma.prediction.findUnique({
      where: {
        executionId,
      },
    });

    if (!prediction) {
      throw new Error(`Prediction not found for execution: ${executionId}`);
    }

    const predictionStatus = this.mapExecutionStatus(
      execution.status,
      prediction.predictionStatus,
    );

    const updateData = {
      predictionStatus,
    };

    if (execution.started_at) {
      updateData.startedAt = new Date(execution.started_at);
    }

    if (execution.completed_at) {
      updateData.completedAt = new Date(execution.completed_at);
    }

    if (execution.result?.metadata) {
      updateData.metadata = execution.result.metadata;
    }

    if (execution.result?.metadata?.rows_processed !== undefined) {
      updateData.rowsProcessed = execution.result.metadata.rows_processed;
    }

    if (
      predictionStatus === PREDICTION_STATUS.COMPLETED &&
      execution.result?.artifacts?.length
    ) {
      const artifact = execution.result.artifacts[0];

      const outputArtifact = await this.synchronizeOutputArtifact({
        experimentId: prediction.experimentId,
        artifact,
      });

      updateData.outputArtifactId = outputArtifact.id;
    }

    const updatedPrediction = await prisma.prediction.update({
      where: {
        id: prediction.id,
      },
      data: updateData,
    });

    return {
      execution,
      prediction: updatedPrediction,
    };
  }

  async synchronizeOutputArtifact({ experimentId, artifact }) {
    const existingArtifact = await prisma.artifact.findFirst({
      where: {
        experimentId,
        artifactName: artifact.artifact_name,
        deletedAt: null,
      },
    });

    if (existingArtifact) {
      return existingArtifact;
    }

    return artifactService.createFromExecutionResult({
      experimentId,
      artifact,
    });
  }

  mapExecutionStatus(executionStatus, currentPredictionStatus) {
    switch (executionStatus) {
      case "QUEUED":
        /*
         * Node marks the prediction as RUNNING immediately after
         * FastAPI accepts the execution.
         *
         * Therefore, a later QUEUED response from FastAPI must
         * not move the Node prediction backwards to CREATED.
         */
        if (currentPredictionStatus === PREDICTION_STATUS.RUNNING) {
          return PREDICTION_STATUS.RUNNING;
        }

        return PREDICTION_STATUS.CREATED;

      case "RUNNING":
        return PREDICTION_STATUS.RUNNING;

      case "SUCCEEDED":
        return PREDICTION_STATUS.COMPLETED;

      case "FAILED":
        return PREDICTION_STATUS.FAILED;

      default:
        throw new Error(
          `Unsupported FastAPI execution status: ${executionStatus}`,
        );
    }
  }
}

export default new PredictionExecutionSyncService();
