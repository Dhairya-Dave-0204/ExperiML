import { prisma } from "#clients/prisma.client";
import artifactService from "#artifact/artifact.service";

const EXPERIMENT_ID = "bf3ffac5-c48c-4913-84b2-577723e895f3";
const PROJECT_ID = "21a5a5af-a972-436c-be40-cc1850f6a5a6";

const USER_ID = "a82a7826-3169-4c40-81d6-9354c390a376";

const main = async () => {
  console.log("Using experiment:", EXPERIMENT_ID);
  console.log("Using project:", PROJECT_ID);

  /*
   * 1. Get all artifacts.
   */
  console.log("\n--- Get artifacts ---");

  const artifacts = await artifactService.getArtifacts({
    userId: USER_ID,
    projectId: PROJECT_ID,
    experimentId: EXPERIMENT_ID,
  });

  console.log("Artifacts found:", artifacts.length);

  for (const artifact of artifacts) {
    console.log({
      id: artifact.id,
      artifactName: artifact.artifactName,
      artifactType: artifact.artifactType,
      fileFormat: artifact.fileFormat,
      filePath: artifact.filePath,
      artifactStatus: artifact.artifactStatus,
    });
  }

  if (artifacts.length !== 2) {
    throw new Error(`Expected 2 artifacts, found ${artifacts.length}.`);
  }

  console.log("Get artifacts: PASSED");

  /*
   * 2. Get one artifact by ID.
   */
  console.log("\n--- Get single artifact ---");

  const artifact = artifacts[0];

  const fetchedArtifact = await artifactService.getArtifact({
    userId: USER_ID,
    projectId: PROJECT_ID,
    experimentId: EXPERIMENT_ID,
    artifactId: artifact.id,
  });

  console.log({
    id: fetchedArtifact.id,
    artifactName: fetchedArtifact.artifactName,
    artifactStatus: fetchedArtifact.artifactStatus,
  });

  if (fetchedArtifact.id !== artifact.id) {
    throw new Error("Fetched artifact ID does not match.");
  }

  console.log("Get single artifact: PASSED");

  /*
   * 3. Prepare artifact download.
   */
  console.log("\n--- Prepare artifact download ---");

  const download = await artifactService.getArtifactForDownload({
    userId: USER_ID,
    projectId: PROJECT_ID,
    experimentId: EXPERIMENT_ID,
    artifactId: artifact.id,
  });

  if (!download.stream) {
    throw new Error("Artifact download stream was not created.");
  }

  console.log("Download artifact:", download.artifact.artifactName);
  console.log("Storage path:", download.artifact.filePath);

  console.log("Artifact download preparation: PASSED");

  /*
   * 4. Close the stream.
   */
  download.stream.destroy();

  /*
   * 5. Soft delete the artifact.
   */
  console.log("\n--- Soft delete artifact ---");

  await artifactService.deleteArtifact({
    userId: USER_ID,
    projectId: PROJECT_ID,
    experimentId: EXPERIMENT_ID,
    artifactId: artifact.id,
  });

  console.log("Soft delete: PASSED");

  /*
   * 6. Verify deleted artifact is no longer returned.
   */
  console.log("\n--- Verify soft deletion ---");

  const remainingArtifacts = await artifactService.getArtifacts({
    userId: USER_ID,
    projectId: PROJECT_ID,
    experimentId: EXPERIMENT_ID,
  });

  console.log("Active artifacts after deletion:", remainingArtifacts.length);

  if (
    remainingArtifacts.some(
      (remainingArtifact) => remainingArtifact.id === artifact.id,
    )
  ) {
    throw new Error("Soft-deleted artifact still appears in active artifacts.");
  }

  console.log("Soft deletion visibility: PASSED");

  /*
   * 7. Verify physical file still exists.
   */
  console.log("\n--- Verify physical file retention ---");

  const artifactStillExists = await prisma.artifact.findUnique({
    where: {
      id: artifact.id,
    },
  });

  if (!artifactStillExists) {
    throw new Error("Artifact database record was physically deleted.");
  }

  console.log("Database record still exists:", Boolean(artifactStillExists));

  console.log("Physical deletion deferred: PASSED");

  /*
   * Cleanup.
   *
   * Permanently remove the test artifact record.
   * The actual physical file is intentionally left untouched.
   */
  await prisma.artifact.delete({
    where: {
      id: artifact.id,
    },
  });

  console.log("\nTest artifact database record deleted.");
};

main()
  .catch((error) => {
    console.error("\nArtifact lifecycle test failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
