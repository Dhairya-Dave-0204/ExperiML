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

import { validate } from "#middleware/validate.middleware";

import { verifyJWT } from "#auth/auth.middleware";

import { upload } from "#middleware/upload.middleware";

const router = Router();

/*
 * POST /
 *
 * Create Prediction
 * Body:
 * - name
 * - predictionType
 *
 * File:
 * - file
 */
router.post(
  "/",
  verifyJWT,

  upload.single("file"),

  validate(predictionParamsSchema, "params"),

  validate(createPredictionSchema, "body"),

  createPrediction,
);

/*
 * GET /
 * Get Predictions
 */
router.get(
  "/",
  verifyJWT,

  validate(predictionParamsSchema, "params"),

  getPredictions,
);

/*
 * GET /:predictionId
 * Get Prediction
 */
router.get(
  "/:predictionId",
  verifyJWT,

  validate(predictionIdParamsSchema, "params"),

  getPredictionById,
);

/*
 * DELETE /:predictionId
 * Soft delete Prediction
 */
router.delete(
  "/:predictionId",
  verifyJWT,

  validate(predictionIdParamsSchema, "params"),

  deletePrediction,
);

export default router;
