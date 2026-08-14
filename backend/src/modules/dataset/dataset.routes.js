import { Router } from "express";

import {
  createDataset,
  getProjectDatasets,
  getDatasetById,
  getDatasetMetadata,
  updateDataset,
  deleteDataset,
} from "./dataset.controller.js";

import { authenticate } from "#middleware/auth.middleware";

import { upload } from "#middleware/upload.middleware";

import { validate } from "#middleware/validate.middleware";

import {
  createDatasetSchema,
  updateDatasetSchema,
  datasetIdSchema,
  projectIdSchema,
} from "./dataset.validation.js";

const router = Router();

/*
 * Create Dataset
 *
 * POST * /api/v1/projects/:projectId/datasets
 *
 * multipart/form-data
 *
 * fields:
 * name
 * file
 */
router.post(
  "/:projectId/datasets",

  authenticate,

  upload.single("file"),

  validate(projectIdSchema, "params"),

  validate(createDatasetSchema, "body"),

  createDataset,
);

/*
 * Get all datasets of a project
 *
 * GET * /api/v1/projects/:projectId/datasets
 */
router.get(
  "/:projectId/datasets",

  authenticate,

  validate(projectIdSchema, "params"),

  getProjectDatasets,
);

/*
 * Get dataset details
 *
 * GET * /api/v1/projects/:projectId/datasets/:datasetId
 */
router.get(
  "/:projectId/datasets/:datasetId",

  authenticate,

  validate(projectIdSchema, "params"),

  validate(datasetIdSchema, "params"),

  getDatasetById,
);

/*
 * Get dataset metadata
 *
 * GET * /api/v1/projects/:projectId/datasets/:datasetId/metadata
 */
router.get(
  "/:projectId/datasets/:datasetId/metadata",

  authenticate,

  validate(projectIdSchema, "params"),

  validate(datasetIdSchema, "params"),

  getDatasetMetadata,
);

/*
 * Update dataset name
 *
 * PATCH * /api/v1/projects/:projectId/datasets/:datasetId
 */
router.patch(
  "/:projectId/datasets/:datasetId",

  authenticate,

  validate(projectIdSchema, "params"),

  validate(datasetIdSchema, "params"),

  validate(updateDatasetSchema, "body"),

  updateDataset,
);

/*
 * Soft delete dataset
 *
 * DELETE * /api/v1/projects/:projectId/datasets/:datasetId
 */
router.delete(
  "/:projectId/datasets/:datasetId",

  authenticate,

  validate(projectIdSchema, "params"),

  validate(datasetIdSchema, "params"),

  deleteDataset,
);

export default router;
