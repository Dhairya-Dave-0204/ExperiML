import { asyncHandler } from "#utils/asyncHandler";
import { ApiResponse } from "#utils/ApiResponse";

import artifactService from "#artifact/artifact.service";

/*
 * ============================================================
 * GET PROJECT EXPERIMENT ARTIFACTS
 * ============================================================
 * GET /api/v1/projects/:projectId/experiments/:experimentId/artifacts
 */

const getArtifacts = asyncHandler(async (req, res) => {
  const { projectId, experimentId } = req.params;

  const artifacts = await artifactService.getArtifacts({
    projectId,
    experimentId,
    userId: req.user.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, artifacts, "Artifacts fetched successfully."));
});

/*
 * ============================================================
 * GET ARTIFACT BY ID
 * ============================================================
 * GET /api/v1/projects/:projectId/experiments/:experimentId/artifacts/:artifactId
 */

const getArtifactById = asyncHandler(async (req, res) => {
  const { projectId, experimentId, artifactId } = req.params;

  const artifact = await artifactService.getArtifact({
    projectId,
    experimentId,
    artifactId,
    userId: req.user.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, artifact, "Artifact fetched successfully."));
});

/*
 * ============================================================
 * DOWNLOAD ARTIFACT
 * ============================================================
 * GET /api/v1/projects/:projectId/experiments/:experimentId/artifacts/:artifactId/download
 *
 * Streams physical artifact file.
 */

const downloadArtifact = asyncHandler(async (req, res) => {
  const { projectId, experimentId, artifactId } = req.params;

  const { artifact, stream } = await artifactService.getArtifactForDownload({
    projectId,
    experimentId,
    artifactId,
    userId: req.user.id,
  });

  res.setHeader(
    "Content-Type",
    artifact.mimeType || "application/octet-stream",
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${artifact.originalFileName}"`,
  );

  stream.pipe(res);
});

/*
 * ============================================================
 * DELETE ARTIFACT
 * ============================================================
 * DELETE /api/v1/projects/:projectId/experiments/:experimentId/artifacts/:artifactId
 *
 * Performs soft delete.
 */

const deleteArtifact = asyncHandler(async (req, res) => {
  const { projectId, experimentId, artifactId } = req.params;

  await artifactService.deleteArtifact({
    projectId,
    experimentId,
    artifactId,
    userId: req.user.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Artifact deleted successfully."));
});

export { getArtifacts, getArtifactById, downloadArtifact, deleteArtifact };
