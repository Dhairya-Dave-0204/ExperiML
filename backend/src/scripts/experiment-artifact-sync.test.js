import { prisma } from "#clients/prisma.client";
import experimentExecutionSyncService from "#services/experiment-execution-sync.service";

const EXECUTION_ID = "01a2dee9-b9ab-42c0-8bd7-a3d8c82b2022";

const main = async () => {
  const experiment = await prisma.experiment.findUnique({
    where: {
      executionId: EXECUTION_ID,
    },
  });

  if (!experiment) {
    throw new Error(`No experiment found for execution ID: ${EXECUTION_ID}`);
  }

  console.log("Using experiment:", experiment.id);
  console.log("Execution ID:", experiment.executionId);

  /*
   * First synchronization.
   */
  console.log("\n--- First synchronization ---");

  const firstSync = await experimentExecutionSyncService.synchronize(
    experiment.executionId,
  );

  console.log("Execution status:", firstSync.execution.status);
  console.log("Experiment status:", firstSync.experiment.experimentStatus);

  const firstArtifacts = await prisma.artifact.findMany({
    where: {
      experimentId: experiment.id,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  console.log("Artifacts after first sync:", firstArtifacts.length);

  for (const artifact of firstArtifacts) {
    console.log({
      id: artifact.id,
      artifactName: artifact.artifactName,
      artifactType: artifact.artifactType,
      filePath: artifact.filePath,
      artifactStatus: artifact.artifactStatus,
    });
  }

  /*
   * Verify expected artifacts.
   */
  if (firstArtifacts.length !== 2) {
    throw new Error(
      `Expected 2 artifacts after first sync, found ${firstArtifacts.length}.`,
    );
  }

  console.log("Artifact creation: PASSED");

  /*
   * Second synchronization.
   * This verifies idempotency.
   */
  console.log("\n--- Second synchronization ---");

  await experimentExecutionSyncService.synchronize(experiment.executionId);

  const secondArtifacts = await prisma.artifact.findMany({
    where: {
      experimentId: experiment.id,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  console.log("Artifacts after second sync:", secondArtifacts.length);

  /*
   * Verify duplicate protection.
   */
  if (secondArtifacts.length !== firstArtifacts.length) {
    throw new Error(
      `Duplicate artifact detected. ` +
        `Expected ${firstArtifacts.length}, ` +
        `found ${secondArtifacts.length}.`,
    );
  }

  console.log("Duplicate protection: PASSED");

  /*
   * Cleanup artifacts created by this test.
   */
//   for (const artifact of firstArtifacts) {
//     await prisma.artifact.delete({
//       where: {
//         id: artifact.id,
//       },
//     });
//   }

//   console.log("\nTest artifacts deleted successfully.");
};

main()
  .catch((error) => {
    console.error("\nExperiment artifact sync test failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
