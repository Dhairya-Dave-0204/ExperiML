import crypto from "crypto";

import { prisma } from "#clients/prisma.client";
import fastApiExecutionService from "#services/fastapi-execution.service";

async function main() {
  console.log("Starting FastAPI execution service test...\n");

  /*
   * 1. Find a READY dataset.
   */
  const dataset = await prisma.dataset.findFirst({
    where: {
      datasetStatus: "READY",
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!dataset) {
    throw new Error(
      "No READY dataset found. Upload/process a dataset before running this test.",
    );
  }

  console.log("Dataset found:");
  console.log({
    id: dataset.id,
    projectId: dataset.projectId,
    version: dataset.datasetVersion,
    format: dataset.datasetFormat,
    filePath: dataset.filePath,
    fileSize: dataset.fileSize.toString(),
  });

  /*
   * 2. Find an existing experiment for this dataset.
   *
   * We only need its definition for this test.
   * We will NOT modify it.
   */
  const experiment = await prisma.experiment.findFirst({
    where: {
      datasetId: dataset.id,
      projectId: dataset.projectId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!experiment) {
    throw new Error(
      "No experiment found for the selected dataset. Create an experiment first.",
    );
  }

  console.log("\nExperiment found:");
  console.log({
    id: experiment.id,
    projectId: experiment.projectId,
    problemType: experiment.problemType,
    algorithmName: experiment.algorithmName,
    status: experiment.experimentStatus,
  });

  /*
   * 3. Generate a temporary execution ID.
   *
   * This ID is NOT persisted in the Experiment table.
   */
  const executionId = crypto.randomUUID();

  console.log("\nTemporary execution ID:");
  console.log(executionId);

  /*
   * 4. Call FastAPI.
   */
  const result = await fastApiExecutionService.createExecution({
    executionId,
    projectId: experiment.projectId,
    experimentId: experiment.id,
    dataset,
    problemType: experiment.problemType,
    algorithmName: experiment.algorithmName,
    configuration: experiment.configuration,
    hyperparameters: experiment.hyperparameters,
  });

  /*
   * 5. Display FastAPI response.
   */
  console.log("\nFastAPI execution response:");
  console.log(result);

  const execution = await fastApiExecutionService.getExecution(executionId);

  console.log("\nFastAPI execution status:");
  console.log(JSON.stringify(execution, null, 2));
}

main()
  .catch((error) => {
    console.error("\nFastAPI execution test failed.");

    if (error.response) {
      console.error("HTTP status:", error.response.status);
      console.error("Response:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
