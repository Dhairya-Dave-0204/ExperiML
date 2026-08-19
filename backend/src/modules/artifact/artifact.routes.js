import { Router } from "express";

import {
  getArtifacts,
  getArtifactById,
  downloadArtifact,
  deleteArtifact,
} from "#artifact/artifact.controller";

import {
  artifactParentParamsSchema,
  artifactParamsSchema,
} from "#artifact/artifact.validation";

import { validate } from "#middleware/validate.middleware";
import { authenticate } from "#middleware/auth.middleware";

const router = Router();

/*
 * ============================================================
 * GET ALL ARTIFACTS
 * ============================================================
 * GET
 * /api/v1/projects/:projectId/experiments/:experimentId/artifacts
 *
 * Retrieves all non-deleted artifacts belonging to an experiment.
 */

router.get(
  "/:projectId/experiments/:experimentId/artifacts",
  authenticate,
  validate(artifactParentParamsSchema, "params"),
  getArtifacts,
);

/*
 * ============================================================
 * DOWNLOAD ARTIFACT
 * ============================================================
 * GET
 * /api/v1/projects/:projectId/experiments/:experimentId/artifacts/:artifactId/download
 *
 * Streams the physical artifact file.
 */

router.get(
  "/:projectId/experiments/:experimentId/artifacts/:artifactId/download",
  authenticate,
  validate(artifactParamsSchema, "params"),
  downloadArtifact,
);

/*
 * ============================================================
 * GET ARTIFACT BY ID
 * ============================================================
 * GET
 * /api/v1/projects/:projectId/experiments/:experimentId/artifacts/:artifactId
 *
 * Retrieves artifact metadata.
 */

router.get(
  "/:projectId/experiments/:experimentId/artifacts/:artifactId",
  authenticate,
  validate(artifactParamsSchema, "params"),
  getArtifactById,
);

/*
 * ============================================================
 * DELETE ARTIFACT
 * ============================================================
 * DELETE
 * /api/v1/projects/:projectId/experiments/:experimentId/artifacts/:artifactId
 *
 * Performs soft deletion.
 */

router.delete(
  "/:projectId/experiments/:experimentId/artifacts/:artifactId",
  authenticate,
  validate(artifactParamsSchema, "params"),
  deleteArtifact,
);

export default router;
