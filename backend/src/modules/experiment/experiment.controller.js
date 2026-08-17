import { asyncHandler } from "#utils/asyncHandler";
import { ApiResponse } from "#utils/ApiResponse";

import experimentService from "#experiment/experiment.service";

/*
 * ============================================================
 * CREATE EXPERIMENT
 * ============================================================
 * POST /api/v1/projects/:projectId/experiments
 */

const createExperiment = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const {
    name,
    datasetId,
    problemType,
    algorithmName,
    configuration,
    hyperparameters,
  } = req.body;

  const experiment = await experimentService.createExperiment({
    projectId,
    userId: req.user.id,
    name,
    datasetId,
    problemType,
    algorithmName,
    configuration,
    hyperparameters,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, experiment, "Experiment created successfully."));
});

/*
 * ============================================================
 * GET PROJECT EXPERIMENTS
 * ============================================================
 * GET /api/v1/projects/:projectId/experiments
 */

const getProjectExperiments = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const experiments = await experimentService.getProjectExperiments({
    projectId,
    userId: req.user.id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, experiments, "Experiments retrieved successfully."),
    );
});

/*
 * ============================================================
 * GET EXPERIMENT BY ID
 * ============================================================
 * GET /api/v1/projects/:projectId/experiments/:experimentId
 */

const getExperimentById = asyncHandler(async (req, res) => {
  const { projectId, experimentId } = req.params;

  const experiment = await experimentService.getExperimentById({
    projectId,
    experimentId,
    userId: req.user.id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, experiment, "Experiment retrieved successfully."),
    );
});

/*
 * ============================================================
 * UPDATE EXPERIMENT
 * ============================================================
 * PATCH /api/v1/projects/:projectId/experiments/:experimentId
 *
 * The service determines which fields are allowed to change based on the current Experiment status.
 */

const updateExperiment = asyncHandler(async (req, res) => {
  const { projectId, experimentId } = req.params;

  const {
    name,
    datasetId,
    problemType,
    algorithmName,
    configuration,
    hyperparameters,
  } = req.body;

  const experiment = await experimentService.updateExperiment({
    projectId,
    experimentId,
    userId: req.user.id,
    name,
    datasetId,
    problemType,
    algorithmName,
    configuration,
    hyperparameters,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, experiment, "Experiment updated successfully."));
});

/*
 * ============================================================
 * DELETE EXPERIMENT
 * ============================================================
 * DELETE /api/v1/projects/:projectId/experiments/:experimentId
 *
 * Performs a soft delete.
 */

const deleteExperiment = asyncHandler(async (req, res) => {
  const { projectId, experimentId } = req.params;

  await experimentService.deleteExperiment({
    projectId,
    experimentId,
    userId: req.user.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Experiment deleted successfully."));
});

export {
  createExperiment,
  getProjectExperiments,
  getExperimentById,
  updateExperiment,
  deleteExperiment,
};
