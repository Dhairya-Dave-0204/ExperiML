import { z } from "zod";

import { PREDICTION_TYPE } from "#prediction/prediction.constants";

/*
 * Route parameter validation
 *
 * Used for:
 * /projects/:projectId/experiments/:experimentId/predictions
 *
 * and:
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
 * V1 supports SINGLE predictions only.
 * BATCH is reserved for a future implementation.
 */
export const createPredictionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Prediction name is required")
    .max(100, "Prediction name cannot exceed 100 characters"),

  predictionType: z
    .literal(PREDICTION_TYPE.SINGLE)
    .default(PREDICTION_TYPE.SINGLE),
});
