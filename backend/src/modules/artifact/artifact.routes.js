import { Router } from "express";

import {
  getProjectModels,
  getArtifacts,
  getArtifactById,
  downloadArtifact,
  deleteArtifact,
  getModelDetails,
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
 * GET PROJECT MODELS
 * ============================================================
 * GET
 * /api/v1/projects/:projectId/models
 *
 * Retrieves all non-deleted model artifacts belonging to a project.
 */

router.get(
  "/:projectId/models",
  authenticate,
  validate(artifactParentParamsSchema.pick({ projectId: true }), "params"),
  getProjectModels,
);

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

router.get(
  "/:projectId/models/:modelId",
  authenticate,
  validate(
    artifactParamsSchema.pick({
      projectId: true,
      artifactId: true,
    }),
    "params",
  ),
  getModelDetails,
);

export default router;
