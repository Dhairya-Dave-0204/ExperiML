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

import { verifyJWT } from "#auth/auth.middleware";

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
 * /projects/:projectId/experiments/:experimentId/predictions
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
  "/projects/:projectId/experiments/:experimentId/predictions",

  verifyJWT,

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
  "/projects/:projectId/experiments/:experimentId/predictions",

  verifyJWT,

  validate(predictionParamsSchema, "params"),

  getPredictions,
);

/*
 * Get Prediction
 *
 * GET
 * /projects/:projectId/experiments/:experimentId/predictions/:predictionId
 */
router.get(
  "/projects/:projectId/experiments/:experimentId/predictions/:predictionId",

  verifyJWT,

  validate(predictionIdParamsSchema, "params"),

  getPredictionById,
);

/*
 * Delete Prediction
 *
 * DELETE
 * /projects/:projectId/experiments/:experimentId/predictions/:predictionId
 */
router.delete(
  "/projects/:projectId/experiments/:experimentId/predictions/:predictionId",

  verifyJWT,

  validate(predictionIdParamsSchema, "params"),

  deletePrediction,
);

export default router;
