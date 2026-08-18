import { prisma } from "#clients/prisma.client";

import { ApiError } from "#utils/ApiError";

import { ARTIFACT_STATUS } from "#artifact/artifact.constants";

import { fileStorageService } from "#infra-services/storage/file-storage.service";

class ArtifactService {
  /**
   * Get all artifacts belonging to an experiment.
   *
   * Flow:
   * User
   *  ↓
   * Project ownership
   *  ↓
   * Experiment ownership
   *  ↓
   * Fetch artifacts
   */
  async getArtifacts({ userId, projectId, experimentId }) {
    const experiment = await prisma.experiment.findFirst({
      where: {
        id: experimentId,

        deletedAt: null,

        project: {
          id: projectId,

          userId,

          deletedAt: null,
        },
      },
    });

    if (!experiment) {
      throw new ApiError(404, "Experiment not found");
    }

    return prisma.artifact.findMany({
      where: {
        experimentId,

        deletedAt: null,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get a single artifact metadata.
   *
   * Does not return the physical file.
   */
  async getArtifact({ userId, projectId, experimentId, artifactId }) {
    const artifact = await prisma.artifact.findFirst({
      where: {
        id: artifactId,

        deletedAt: null,

        experiment: {
          id: experimentId,

          deletedAt: null,

          project: {
            id: projectId,

            userId,

            deletedAt: null,
          },
        },
      },
    });

    if (!artifact) {
      throw new ApiError(404, "Artifact not found");
    }

    return artifact;
  }

  /**
   * Prepare artifact download.
   *
   * Responsibilities:
   * - validate ownership
   * - validate artifact state
   * - validate physical file existence
   * - create storage stream
   *
   * Controller handles HTTP streaming.
   */
  async getArtifactForDownload({
    userId,
    projectId,
    experimentId,
    artifactId,
  }) {
    const artifact = await this.getArtifact({
      userId,
      projectId,
      experimentId,
      artifactId,
    });

    if (artifact.artifactStatus !== ARTIFACT_STATUS.AVAILABLE) {
      throw new ApiError(400, "Artifact is not available for download");
    }

    const fileExists = await fileStorageService.exists(artifact.filePath);

    if (!fileExists) {
      throw new ApiError(404, "Artifact file not found in storage");
    }

    const stream = fileStorageService.createReadStream(artifact.filePath);

    return {
      artifact,

      stream,
    };
  }

  /**
   * Soft delete artifact.
   *
   * Physical deletion is intentionally deferred.
   */
  async deleteArtifact({ userId, projectId, experimentId, artifactId }) {
    const artifact = await this.getArtifact({
      userId,
      projectId,
      experimentId,
      artifactId,
    });

    await prisma.artifact.update({
      where: {
        id: artifact.id,
      },

      data: {
        deletedAt: new Date(),
      },
    });

    return true;
  }
}

export default new ArtifactService();
