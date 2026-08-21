import { z } from "zod";

import { PREDICTION_TYPE } from "#prediction/prediction.constants.js";

/*
 * Route parameter validation
 *
 * Used for:
 *
 * /projects/:projectId/experiments/:experimentId/predictions
 *
 * and:
 *
 * /projects/:projectId/experiments/:experimentId/predictions/:predictionId
 */
export const predictionParamsSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),

  experimentId: z.string().uuid("Invalid experiment ID"),
});

export const predictionIdParamsSchema = predictionParamsSchema.extend({
  predictionId: z.string().uuid("Invalid prediction ID"),
});

/*
 * Prediction creation validation
 *
 * Represents a prediction execution request.
 */
export const createPredictionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Prediction name is required")
    .max(100, "Prediction name cannot exceed 100 characters"),

  predictionType: z
    .enum([PREDICTION_TYPE.SINGLE, PREDICTION_TYPE.BATCH])
    .default(PREDICTION_TYPE.SINGLE),
});
