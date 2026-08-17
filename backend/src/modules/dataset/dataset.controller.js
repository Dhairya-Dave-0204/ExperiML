import { asyncHandler } from "#utils/asyncHandler";
import { ApiResponse } from "#utils/ApiResponse";
import datasetService from "#dataset/dataset.service";
import { ApiError } from "#utils/ApiError";

const createDataset = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const { name } = req.body;

  const file = req.file;

  if (!file) {
    throw new ApiError(400, "Dataset file is required");
  }

  const dataset = await datasetService.createDataset({
    projectId,

    userId: req.user.id,

    name,

    file,
  });

  return res.status(201).json(
    new ApiResponse(
      201,

      dataset,

      "Dataset created successfully",
    ),
  );
});

const getProjectDatasets = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const datasets = await datasetService.getProjectDatasets({
    projectId,

    userId: req.user.id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,

      datasets,

      "Datasets fetched successfully",
    ),
  );
});

const getDatasetById = asyncHandler(async (req, res) => {
  const { projectId, datasetId } = req.params;

  const dataset = await datasetService.getDatasetById({
    projectId,

    datasetId,

    userId: req.user.id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,

      dataset,

      "Dataset fetched successfully",
    ),
  );
});

const getDatasetMetadata = asyncHandler(async (req, res) => {
  const { projectId, datasetId } = req.params;

  const metadata = await datasetService.getDatasetMetadata({
    projectId,

    datasetId,

    userId: req.user.id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,

      metadata,

      "Dataset metadata fetched successfully",
    ),
  );
});

const updateDataset = asyncHandler(async (req, res) => {
  const { projectId, datasetId } = req.params;

  const { name } = req.body;

  const dataset = await datasetService.updateDataset({
    projectId,

    datasetId,

    userId: req.user.id,

    name,
  });

  return res.status(200).json(
    new ApiResponse(
      200,

      dataset,

      "Dataset updated successfully",
    ),
  );
});

const deleteDataset = asyncHandler(async (req, res) => {
  const { projectId, datasetId } = req.params;

  await datasetService.deleteDataset({
    projectId,

    datasetId,

    userId: req.user.id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,

      null,

      "Dataset deleted successfully",
    ),
  );
});

export {
  createDataset,
  getProjectDatasets,
  getDatasetById,
  getDatasetMetadata,
  updateDataset,
  deleteDataset,
};
