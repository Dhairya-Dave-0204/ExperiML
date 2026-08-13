import {
  createProject as createProjectService,
  getProjects as getProjectsService,
  getProjectById as getProjectByIdService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
} from "./project.service.js";

import { ApiResponse } from "#utils/ApiResponse";
import { asyncHandler } from "#utils/asyncHandler";

/*
 * ===============================================
 * Create Project * POST /api/v1/projects
 * ===============================================
 *
 */

const createProject = asyncHandler(async (req, res) => {
  const project = await createProjectService(req.user.id, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully."));
});

/*
 * ===============================================
 * Get All Projects * GET /api/v1/projects
 * ===============================================
 *
 */

const getProjects = asyncHandler(async (req, res) => {
  const projects = await getProjectsService(req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects retrieved successfully."));
});

/*
 * ===============================================
 * Get Single Project * GET /api/v1/projects/:id
 * ===============================================
 *
 */

const getProjectById = asyncHandler(async (req, res) => {
  const project = await getProjectByIdService(req.user.id, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project retrieved successfully."));
});

/*
 * ===============================================
 * Update Project * PATCH /api/v1/projects/:id
 * ===============================================
 *
 */

const updateProject = asyncHandler(async (req, res) => {
  const project = await updateProjectService(
    req.user.id,
    req.params.id,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully."));
});

/*
 * ===============================================
 * Delete Project * /api/v1/projects/:id
 * ===============================================
 *
 */

const deleteProject = asyncHandler(async (req, res) => {
  const project = await deleteProjectService(req.user.id, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project deleted successfully."));
});

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
