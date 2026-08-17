import { Router } from "express";

import {
  createExperiment,
  getProjectExperiments,
  getExperimentById,
  updateExperiment,
  deleteExperiment,
} from "./experiment.controller.js";

import { authenticate } from "#middleware/auth.middleware";
import { validate } from "#middleware/validate.middleware";

import {
  createExperimentSchema,
  updateExperimentSchema,
  projectIdSchema,
  projectExperimentIdSchema,
} from "./experiment.validation.js";

const router = Router();

/*
 * ============================================================
 * CREATE EXPERIMENT
 * ============================================================
 * POST /api/v1/projects/:projectId/experiments
 *
 * Creates an Experiment definition.
 * Current V1 behavior:
 * - Dataset must belong to the Project.
 * - Dataset must be READY.
 * - Experiment starts with CREATED status.
 * - No ML execution is performed.
 */

router.post(
  "/:projectId/experiments",
  authenticate,
  validate(projectIdSchema, "params"),
  validate(createExperimentSchema, "body"),
  createExperiment,
);

/*
 * ============================================================
 * GET PROJECT EXPERIMENTS
 * ============================================================
 * GET /api/v1/projects/:projectId/experiments
 *
 * Retrieves all non-deleted Experiments belonging to the specified Project.
 */

router.get(
  "/:projectId/experiments",
  authenticate,
  validate(projectIdSchema, "params"),
  getProjectExperiments,
);

/*
 * ============================================================
 * GET EXPERIMENT BY ID
 * ============================================================
 * GET /api/v1/projects/:projectId/experiments/:experimentId
 *
 * Retrieves a single Experiment.
 */

router.get(
  "/:projectId/experiments/:experimentId",
  authenticate,
  validate(projectExperimentIdSchema, "params"),
  getExperimentById,
);

/*
 * ============================================================
 * UPDATE EXPERIMENT
 * ============================================================
 *
 * PATCH /api/v1/projects/:projectId/experiments/:experimentId
 *
 * D8-B:
 * CREATED  -> execution definition may be modified
 * QUEUED / TRAINING / COMPLETED / FAILED / CANCELLED -> only name may be modified
 *
 * The service layer enforces these lifecycle rules.
 */

router.patch(
  "/:projectId/experiments/:experimentId",
  authenticate,
  validate(projectExperimentIdSchema, "params"),
  validate(updateExperimentSchema, "body"),
  updateExperiment,
);

/*
 * ============================================================
 * DELETE EXPERIMENT
 * ============================================================
 * DELETE /api/v1/projects/:projectId/experiments/:experimentId
 *
 * Performs a soft delete.
 *
 */

router.delete(
  "/:projectId/experiments/:experimentId",
  authenticate,
  validate(projectExperimentIdSchema, "params"),
  deleteExperiment,
);

export default router;
