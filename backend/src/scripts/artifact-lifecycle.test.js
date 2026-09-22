import assert from "assert/strict";
import fs from "fs/promises";
import path from "path";

import { prisma } from "#clients/prisma.client";
import artifactService from "#artifact/artifact.service";
import { storageConfig } from "#config/storage.config";

const main = async () => {
  let artifactId = null;
  let artifactFilePath = null;

  try {
    /*
     * 1. Find an existing experiment.
     *
     * Experiment -> Project -> User
     *
     * The Prisma schema defines:
     * Experiment.project
     * Project.user
     */
    const experiment = await prisma.experiment.findFirst({
      where: {
        deletedAt: null,
      },
      include: {
        project: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!experiment) {
      throw new Error("No experiment found for artifact lifecycle test.");
    }

    const experimentId = experiment.id;
    const projectId = experiment.projectId;
    const userId = experiment.project.userId;

    console.log("Using experiment:", experimentId);
    console.log("Using project:", projectId);
    console.log("Using user:", userId);

    /*
     * 2. Create the physical test artifact file.
     *
     * Artifact storage structure:
     *
     * storage/artifacts/
     *   projects/{projectId}/
     *     experiments/{experimentId}/
     *       artifacts/{fileName}
     */
    const artifactDirectory = path.join(
      storageConfig.artifactsPath,
      "projects",
      projectId,
      "experiments",
      experimentId,
      "artifacts",
    );

    await fs.mkdir(artifactDirectory, {
      recursive: true,
    });

    const artifactFileName = `artifact-lifecycle-test-${Date.now()}.txt`;

    artifactFilePath = path.join(artifactDirectory, artifactFileName);

    const artifactContent = "ExperiML artifact lifecycle integration test.";

    await fs.writeFile(artifactFilePath, artifactContent, "utf8");

    /*
     * Convert the physical path into the storage key
     * stored in the Artifact record.
     */
    const storageKey = path
      .relative(storageConfig.artifactsPath, artifactFilePath)
      .split(path.sep)
      .join("/");

    console.log("\nCreated physical test artifact:");
    console.log(artifactFilePath);

    console.log("Storage key:", storageKey);

    /*
     * 3. Create the Artifact database record.
     */
    const artifact = await artifactService.createFromExecutionResult({
      experimentId,
      artifact: {
        artifact_name: artifactFileName,
        artifact_type: "OTHER",
        file_format: "txt",
        original_file_name: artifactFileName,
        storage_key: storageKey,
        file_size: Buffer.byteLength(artifactContent),
        mime_type: "text/plain",
        checksum: "artifact-lifecycle-test-checksum",
        metadata: {
          test: true,
        },
      },
    });

    artifactId = artifact.id;

    console.log("\nCreated database artifact:", artifactId);

    /*
     * 4. Get all artifacts.
     */
    console.log("\n--- Get artifacts ---");

    const artifacts = await artifactService.getArtifacts({
      userId,
      projectId,
      experimentId,
    });

    const createdArtifact = artifacts.find((item) => item.id === artifactId);

    assert.ok(
      createdArtifact,
      "Created artifact was not returned by getArtifacts.",
    );

    console.log("Get artifacts: PASSED");

    /*
     * 5. Get one artifact.
     */
    console.log("\n--- Get single artifact ---");

    const fetchedArtifact = await artifactService.getArtifact({
      userId,
      projectId,
      experimentId,
      artifactId,
    });

    assert.equal(fetchedArtifact.id, artifactId);

    console.log("Get single artifact: PASSED");

    /*
     * 6. Prepare artifact download.
     */
    console.log("\n--- Prepare artifact download ---");

    const download = await artifactService.getArtifactForDownload({
      userId,
      projectId,
      experimentId,
      artifactId,
    });

    assert.ok(download.stream, "Artifact download stream was not created.");

    assert.equal(download.artifact.id, artifactId);

    console.log("Download artifact:", download.artifact.artifactName);

    console.log("Storage path:", download.artifact.filePath);

    console.log("Artifact download preparation: PASSED");

    /*
     * 7. Close the download stream.
     */
    download.stream.destroy();

    /*
     * 8. Soft delete the artifact.
     */
    console.log("\n--- Soft delete artifact ---");

    await artifactService.deleteArtifact({
      userId,
      projectId,
      experimentId,
      artifactId,
    });

    console.log("Soft delete: PASSED");

    /*
     * 9. Verify deleted artifact is no longer returned.
     */
    console.log("\n--- Verify soft deletion ---");

    const remainingArtifacts = await artifactService.getArtifacts({
      userId,
      projectId,
      experimentId,
    });

    assert.equal(
      remainingArtifacts.some((item) => item.id === artifactId),
      false,
    );

    console.log("Soft deletion visibility: PASSED");

    /*
     * 10. Verify database record still exists.
     */
    console.log("\n--- Verify database record retention ---");

    const artifactStillExists = await prisma.artifact.findUnique({
      where: {
        id: artifactId,
      },
    });

    assert.ok(
      artifactStillExists,
      "Artifact database record was physically deleted.",
    );

    assert.ok(artifactStillExists.deletedAt, "Artifact deletedAt was not set.");

    console.log("Database record still exists: true");

    console.log("Soft deletion persistence: PASSED");

    /*
     * 11. Verify physical file still exists.
     *
     * ArtifactService performs a soft delete, so the physical
     * file should still exist at this point.
     */
    console.log("\n--- Verify physical file retention ---");

    const physicalFileExists = await fs
      .access(artifactFilePath)
      .then(() => true)
      .catch(() => false);

    assert.equal(
      physicalFileExists,
      true,
      "Physical artifact file was deleted.",
    );

    console.log("Physical artifact file still exists: true");

    console.log("Physical deletion deferred: PASSED");

    console.log(
      "\n🎉 Artifact lifecycle integration test completed successfully.",
    );
  } finally {
    /*
     * 12. Test cleanup.
     *
     * Production behavior remains soft deletion.
     * We permanently remove our test record here so the test
     * does not pollute the development database.
     */
    if (artifactId) {
      await prisma.artifact.deleteMany({
        where: {
          id: artifactId,
        },
      });
    }

    /*
     * Remove the physical test file.
     */
    if (artifactFilePath) {
      await fs.rm(artifactFilePath, {
        force: true,
      });
    }

    await prisma.$disconnect();
  }
};

main().catch((error) => {
  console.error("\nArtifact lifecycle test failed:");

  console.error(error);

  process.exitCode = 1;
});
