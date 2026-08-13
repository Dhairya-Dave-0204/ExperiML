import { Router } from "express";

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "./project.controller.js";

import {
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
} from "./project.validation.js";

import { authenticate } from "#middleware/auth.middleware";
import { validate } from "#middleware/validate.middleware";

const router = Router();

/*
 * ===============================================
 * All project routes require authentication
 * ===============================================
 * Every request must contain: Authorization: Bearer <access_token>
 *
 */

router.use(authenticate);

/*
 * ===============================================
 * Create Project * POST /api/v1/projects
 * ===============================================
 *
 * Body:
 *
 * {
 *   name,
 *   description?
 * }
 *
 */

router.post("/", validate(createProjectSchema), createProject);

/*
 * ===============================================
 * Get All Projects * GET /api/v1/projects
 * ===============================================
 *
 * Returns projects belonging only to
 * the authenticated user.
 *
 */

router.get("/", getProjects);

/*
 * ===============================================
 * Get Single Project * GET /api/v1/projects/:id
 * ===============================================
 *
 */

router.get("/:id", validate(projectIdSchema, "params"), getProjectById);

/*
 * ===============================================
 * Update Project * /api/v1/projects/:id
 * ===============================================
 *
 */

router.patch(
  "/:id",
  validate(projectIdSchema, "params"),
  validate(updateProjectSchema),
  updateProject,
);

/*
 * ===============================================
 * Delete Project * /api/v1/projects/:id
 * ===============================================
 *
 * Performs soft delete.
 */

router.delete("/:id", validate(projectIdSchema, "params"), deleteProject);

export default router;
