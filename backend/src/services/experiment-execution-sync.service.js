import { prisma } from "#clients/prisma.client";
import fastApiExecutionService from "#services/fastapi-execution.service";
import artifactService from "#artifact/artifact.service";

import { EXPERIMENT_STATUSES } from "#experiment/experiment.constants";

class ExperimentExecutionSyncService {
  async synchronize(executionId) {
    const execution = await fastApiExecutionService.getExecution(executionId);

    const experiment = await prisma.experiment.findUnique({
      where: {
        executionId,
      },
    });

    if (!experiment) {
      throw new Error(`Experiment not found for execution: ${executionId}`);
    }

    const experimentStatus = this.mapExecutionStatus(execution.status);

    const updateData = {
      experimentStatus,
    };

    if (execution.started_at) {
      updateData.startedAt = new Date(execution.started_at);
    }

    if (execution.completed_at) {
      updateData.completedAt = new Date(execution.completed_at);
    }

    if (execution.result?.metrics) {
      updateData.metrics = execution.result.metrics;
    }

    if (execution.result?.artifacts?.length) {
      await this.synchronizeArtifacts({
        experimentId: experiment.id,
        artifacts: execution.result.artifacts,
      });
    }

    const updatedExperiment = await prisma.experiment.update({
      where: {
        id: experiment.id,
      },
      data: updateData,
    });

    return {
      execution,
      experiment: updatedExperiment,
    };
  }

  async synchronizeArtifacts({ experimentId, artifacts }) {
    for (const artifact of artifacts) {
      const existingArtifact = await prisma.artifact.findFirst({
        where: {
          experimentId,
          artifactName: artifact.artifact_name,
          deletedAt: null,
        },
      });

      if (existingArtifact) {
        continue;
      }

      await artifactService.createFromExecutionResult({
        experimentId,
        artifact,
      });
    }
  }

  mapExecutionStatus(executionStatus) {
    switch (executionStatus) {
      case "QUEUED":
        return EXPERIMENT_STATUSES.QUEUED;

      case "RUNNING":
        return EXPERIMENT_STATUSES.TRAINING;

      case "SUCCEEDED":
        return EXPERIMENT_STATUSES.COMPLETED;

      case "FAILED":
        return EXPERIMENT_STATUSES.FAILED;

      default:
        throw new Error(
          `Unsupported FastAPI execution status: ${executionStatus}`,
        );
    }
  }
}

export default new ExperimentExecutionSyncService();
