import { Router } from "express";

import {
  createPrediction,
  getPredictions,
  getPredictionById,
  deletePrediction,
} from "./prediction.controller.js";

import {
  predictionParamsSchema,
  predictionIdParamsSchema,
  createPredictionSchema,
} from "./prediction.validation.js";

import { authenticate } from "#middleware/auth.middleware";

import { validate } from "#middleware/validate.middleware";

import { upload } from "#middleware/upload.middleware";

const router = Router();

/*
 * Prediction routes
 *
 * Base:
 * /api/v1/projects/:projectId/experiments/:experimentId/predictions
 */

/*
 * Create Prediction
 *
 * POST
 * "/:projectId/experiments/:experimentId/predictions"
 *
 * multipart/form-data
 * Fields:
 * name
 * predictionType
 *
 * File:
 * file
 */
router.post(
  "/:projectId/experiments/:experimentId/predictions",

  authenticate,

  upload.single("file"),

  validate(predictionParamsSchema, "params"),

  validate(createPredictionSchema, "body"),

  createPrediction,
);

/*
 * Get Predictions
 *
 * GET
 * /projects/:projectId/experiments/:experimentId/predictions
 */
router.get(
  "/:projectId/experiments/:experimentId/predictions",

  authenticate,

  validate(predictionParamsSchema, "params"),

  getPredictions,
);

/*
 * Get Prediction
 *
 * GET
 * "/:projectId/experiments/:experimentId/predictions/:predictionId"
 */
router.get(
  "/:projectId/experiments/:experimentId/predictions/:predictionId",

  authenticate,

  validate(predictionIdParamsSchema, "params"),

  getPredictionById,
);

/*
 * Delete Prediction
 *
 * DELETE
 * /:projectId/experiments/:experimentId/predictions/:predictionId
 */
router.delete(
  "/:projectId/experiments/:experimentId/predictions/:predictionId",

  authenticate,

  validate(predictionIdParamsSchema, "params"),

  deletePrediction,
);

export default router;
