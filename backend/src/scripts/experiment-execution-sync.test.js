import { prisma } from "#clients/prisma.client";
import experimentExecutionSyncService from "#services/experiment-execution-sync.service";

const EXECUTION_ID =
  "adc9d6a8-29d1-4051-87c7-1668d6181a41";

async function main() {
  console.log("Starting experiment execution sync test...\n");

  console.log("Execution ID:");
  console.log(EXECUTION_ID);

  const before = await prisma.experiment.findUnique({
    where: {
      executionId: EXECUTION_ID,
    },
  });

  if (!before) {
    throw new Error(
      `No experiment found for execution ID: ${EXECUTION_ID}`,
    );
  }

  console.log("\nExperiment before synchronization:");
  console.log({
    id: before.id,
    status: before.experimentStatus,
    executionId: before.executionId,
    metrics: before.metrics,
    startedAt: before.startedAt,
    completedAt: before.completedAt,
  });

  const updated =
    await experimentExecutionSyncService.synchronize(
      EXECUTION_ID,
    );

  console.log("\nExperiment after synchronization:");
  console.log({
    id: updated.id,
    status: updated.experimentStatus,
    executionId: updated.executionId,
    metrics: updated.metrics,
    startedAt: updated.startedAt,
    completedAt: updated.completedAt,
  });

  console.log("\nSynchronization test completed successfully.");
}

main()
  .catch((error) => {
    console.error("\nSynchronization test failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });