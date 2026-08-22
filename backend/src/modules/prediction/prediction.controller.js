import {
  createPrediction as createPredictionService,
  getPredictions as getPredictionsService,
  getPredictionById as getPredictionByIdService,
  deletePrediction as deletePredictionService,
} from "#prediction/prediction.service";

import { ApiResponse } from "#utils/ApiResponse";
import { asyncHandler } from "#utils/asyncHandler";

/*
 * Create Prediction
 *
 * POST
 * /projects/:projectId/experiments/:experimentId/predictions
 */
const createPrediction = asyncHandler(async (req, res) => {
  const { projectId, experimentId } = req.params;

  const prediction = await createPredictionService({
    projectId,
    experimentId,

    userId: req.user.id,

    data: req.body,

    file: req.file,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, prediction, "Prediction created successfully"));
});

/*
 * Get Predictions
 *
 * GET
 * /projects/:projectId/experiments/:experimentId/predictions
 */
const getPredictions = asyncHandler(async (req, res) => {
  const { projectId, experimentId } = req.params;

  const predictions = await getPredictionsService({
    projectId,
    experimentId,

    userId: req.user.id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, predictions, "Predictions fetched successfully"),
    );
});

/*
 * Get Prediction By Id
 *
 * GET
 * /projects/:projectId/experiments/:experimentId/predictions/:predictionId
 */
const getPredictionById = asyncHandler(async (req, res) => {
  const { projectId, experimentId, predictionId } = req.params;

  const prediction = await getPredictionByIdService({
    projectId,
    experimentId,
    predictionId,

    userId: req.user.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, prediction, "Prediction fetched successfully"));
});

/*
 * Delete Prediction
 *
 * DELETE
 * /projects/:projectId/experiments/:experimentId/predictions/:predictionId
 */
const deletePrediction = asyncHandler(async (req, res) => {
  const { projectId, experimentId, predictionId } = req.params;

  await deletePredictionService({
    projectId,
    experimentId,
    predictionId,

    userId: req.user.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Prediction deleted successfully"));
});

export {
  createPrediction,
  getPredictions,
  getPredictionById,
  deletePrediction,
};
