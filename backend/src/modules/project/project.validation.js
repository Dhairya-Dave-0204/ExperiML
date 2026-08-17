import { z } from "zod";
import { PROJECT_NAME_MIN_LENGTH, PROJECT_NAME_MAX_LENGTH, PROJECT_DESCRIPTION_MAX_LENGTH } from "./project.constants.js"

/*
 * ===============================================
 * Create Project Schema
 * ===============================================
 *
 * Used for: * POST /api/v1/projects
 */

const createProjectSchema = z.object({
  name: z
    .string({
      required_error: "Project name is required.",
    })
    .trim()
    .min(
      PROJECT_NAME_MIN_LENGTH,
      `Project name must be at least ${PROJECT_NAME_MIN_LENGTH} characters.`,
    )
    .max(
      PROJECT_NAME_MAX_LENGTH,
      `Project name cannot exceed ${PROJECT_NAME_MAX_LENGTH} characters.`,
    ),

  description: z
    .string()
    .trim()
    .max(
      PROJECT_DESCRIPTION_MAX_LENGTH,
      `Description cannot exceed ${PROJECT_DESCRIPTION_MAX_LENGTH} characters.`,
    )
    .optional(),
});

/*
 * ===============================================
 * Update Project Schema
 * ===============================================
 *
 * Used for: * PATCH /api/v1/projects/:id
 */

const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(
        PROJECT_NAME_MIN_LENGTH,
        `Project name must be at least ${PROJECT_NAME_MIN_LENGTH} characters.`,
      )
      .max(
        PROJECT_NAME_MAX_LENGTH,
        `Project name cannot exceed ${PROJECT_NAME_MAX_LENGTH} characters.`,
      )
      .optional(),

    description: z
      .string()
      .trim()
      .max(
        PROJECT_DESCRIPTION_MAX_LENGTH,
        `Description cannot exceed ${PROJECT_DESCRIPTION_MAX_LENGTH} characters.`,
      )
      .optional(),

    projectStatus: z.enum(["ACTIVE", "ARCHIVED"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update the project.",
  });

/*
 * ===============================================
 * Project ID Validation
 * ===============================================
 *
 * Used for:
 * GET /projects/:id
 * PATCH /projects/:id
 * DELETE /projects/:id
 */

const projectIdSchema = z.object({
  id: z.string({
    required_error: "Project ID is required.",
  }),
});

export { createProjectSchema, updateProjectSchema, projectIdSchema };
