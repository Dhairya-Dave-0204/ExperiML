import { prisma } from "#clients/prisma.client";
import fastApiExecutionService from "#services/fastapi-execution.service";

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

    return prisma.experiment.update({
      where: {
        id: experiment.id,
      },
      data: updateData,
    });
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
