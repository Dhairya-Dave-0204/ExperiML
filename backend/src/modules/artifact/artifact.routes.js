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
import { authMiddleware } from "#middleware/auth.middleware";

const router = Router();

/*
 * ============================================================
 * GET ALL ARTIFACTS
 * ============================================================
 *
 * GET
 * /projects/:projectId/experiments/:experimentId/artifacts
 */

router.get(
  "/",
  authMiddleware,
  validate(artifactParentParamsSchema),
  getArtifacts,
);

/*
 * ============================================================
 * GET ARTIFACT BY ID
 * ============================================================
 *
 * GET
 * /projects/:projectId/experiments/:experimentId/artifacts/:artifactId
 */

router.get(
  "/:artifactId",
  authMiddleware,
  validate(artifactParamsSchema),
  getArtifactById,
);

/*
 * ============================================================
 * DOWNLOAD ARTIFACT
 * ============================================================
 *
 * GET
 * /projects/:projectId/experiments/:experimentId/artifacts/:artifactId/download
 */

router.get(
  "/:artifactId/download",
  authMiddleware,
  validate(artifactParamsSchema),
  downloadArtifact,
);

/*
 * ============================================================
 * DELETE ARTIFACT
 * ============================================================
 *
 * DELETE
 * /projects/:projectId/experiments/:experimentId/artifacts/:artifactId
 */

router.delete(
  "/:artifactId",
  authMiddleware,
  validate(artifactParamsSchema),
  deleteArtifact,
);

export default router;
