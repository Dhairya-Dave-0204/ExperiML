import experimentExecutionSyncService from "#services/experiment-execution-sync.service";

class ExperimentExecutionPollerService {
  constructor() {
    this.pollIntervalMs = 2000;
    this.activeExecutions = new Set();
  }

  async start(executionId) {
    if (this.activeExecutions.has(executionId)) {
      return;
    }

    this.activeExecutions.add(executionId);

    try {
      await this.poll(executionId);
    } finally {
      this.activeExecutions.delete(executionId);
    }
  }

  async poll(executionId) {
    while (true) {
      const { execution } =
        await experimentExecutionSyncService.synchronize(
          executionId,
        );

      if (
        execution.status === "SUCCEEDED" ||
        execution.status === "FAILED"
      ) {
        return;
      }

      await this.sleep(this.pollIntervalMs);
    }
  }

  sleep(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
}

export default new ExperimentExecutionPollerService();