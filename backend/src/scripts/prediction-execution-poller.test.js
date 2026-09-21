import assert from "assert";

import predictionExecutionSyncService from "#services/prediction-execution-sync.service";
import predictionExecutionPollerService from "#services/prediction-execution-poller.service";

const originalSynchronize = predictionExecutionSyncService.synchronize;

const originalSleep = predictionExecutionPollerService.sleep;

const run = async () => {
  let synchronizeCalls = 0;

  predictionExecutionSyncService.synchronize = async (executionId) => {
    synchronizeCalls += 1;

    assert.strictEqual(executionId, "execution-1");

    if (synchronizeCalls === 1) {
      return {
        execution: {
          status: "RUNNING",
        },
      };
    }

    return {
      execution: {
        status: "SUCCEEDED",
      },
    };
  };

  let sleepCalls = 0;

  predictionExecutionPollerService.sleep = async (milliseconds) => {
    sleepCalls += 1;

    assert.strictEqual(milliseconds, 2000);
  };

  await predictionExecutionPollerService.start("execution-1");

  assert.strictEqual(synchronizeCalls, 2);

  assert.strictEqual(sleepCalls, 1);

  assert.strictEqual(
    predictionExecutionPollerService.activeExecutions.has("execution-1"),
    false,
  );

  console.log("Prediction execution poller tests passed.");
};

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    predictionExecutionSyncService.synchronize = originalSynchronize;

    predictionExecutionPollerService.sleep = originalSleep;
  });
