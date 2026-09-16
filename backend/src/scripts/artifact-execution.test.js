import { prisma } from "#clients/prisma.client";
import artifactService from "#artifact/artifact.service";

const main = async () => {
  const experiment = await prisma.experiment.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!experiment) {
    throw new Error("No experiment found.");
  }

  console.log("Using experiment:", experiment.id);

  const artifactResult = {
    artifact_name: "test-model.joblib",
    artifact_type: "MODEL",
    file_format: "joblib",
    original_file_name: "test-model.joblib",
    storage_key: "projects/test/experiments/test/artifacts/test-model.joblib",
    file_size: 12345,
    mime_type: "application/octet-stream",
    checksum: "test-checksum",
    metadata: {
      test: true,
    },
  };

  const artifact = await artifactService.createFromExecutionResult({
    experimentId: experiment.id,
    artifact: artifactResult,
  });

  console.log("\nCreated artifact:");
  console.log({
    id: artifact.id,
    experimentId: artifact.experimentId,
    artifactName: artifact.artifactName,
    artifactType: artifact.artifactType,
    fileFormat: artifact.fileFormat,
    originalFileName: artifact.originalFileName,
    filePath: artifact.filePath,
    fileSize: artifact.fileSize,
    mimeType: artifact.mimeType,
    checksum: artifact.checksum,
    metadata: artifact.metadata,
    artifactStatus: artifact.artifactStatus,
  });

  // Cleanup test record.
  await prisma.artifact.delete({
    where: {
      id: artifact.id,
    },
  });

  console.log("\nTest artifact deleted successfully.");
};

main()
  .catch((error) => {
    console.error("\nArtifact execution test failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
