import { z } from "zod";

import { EXPERIMENT_PROBLEM_TYPES } from "./experiment.constants.js";

/*
 * ============================================================
 * CREATE EXPERIMENT
 * ============================================================
 *
 * Validates the structure of an Experiment creation request. Node validates the API contract here.
 *
 * Algorithm-specific validation, such as whether a particular algo supports the selected problem type
 * or whether a hyperparameter is valid for that algo, will be handled later by the ML/Python service
 */

export const createExperimentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Experiment name must contain at least 2 characters")
    .max(255, "Experiment name cannot exceed 255 characters"),

  datasetId: z.string().uuid("Invalid dataset ID"),

  problemType: z.enum(
    Object.values(EXPERIMENT_PROBLEM_TYPES),
    "Invalid experiment problem type",
  ),

  algorithmName: z
    .string()
    .trim()
    .min(1, "Algorithm name is required")
    .max(255, "Algorithm name cannot exceed 255 characters"),

  configuration: z.record(z.string(), z.unknown()).default({}),

  hyperparameters: z.record(z.string(), z.unknown()).default({}),
});

/*
 * ============================================================
 * UPDATE EXPERIMENT
 * ============================================================
 *
 * The fields allowed here are validated structurally.
 *
 * D8-B lifecycle restrictions are NOT handled by Zod because they depend on the current
 * Experiment status stored in the database.
 *
 * The service layer will determine which fields may actually be modified:
 * CREATED -> execution definition can be modified
 * QUEUED / TRAINING / COMPLETED / FAILED / CANCELLED -> only `name` may be modified
 */

export const updateExperimentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Experiment name must contain at least 2 characters")
    .max(255, "Experiment name cannot exceed 255 characters")
    .optional(),

  datasetId: z.string().uuid("Invalid dataset ID").optional(),

  problemType: z
    .enum(
      Object.values(EXPERIMENT_PROBLEM_TYPES),
      "Invalid experiment problem type",
    )
    .optional(),

  algorithmName: z
    .string()
    .trim()
    .min(1, "Algorithm name is required")
    .max(255, "Algorithm name cannot exceed 255 characters")
    .optional(),

  configuration: z.record(z.string(), z.unknown()).optional(),

  hyperparameters: z.record(z.string(), z.unknown()).optional(),
});

/*
 * ============================================================
 * EXPERIMENT ID
 * ============================================================
 */

export const experimentIdSchema = z.object({
  experimentId: z.string().uuid("Invalid experiment ID"),
});

/*
 * ============================================================
 * PROJECT + EXPERIMENT ID
 * ============================================================
 *
 * Used for routes such as: /projects/:projectId/experiments/:experimentId
 */

export const projectExperimentIdSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),

  experimentId: z.string().uuid("Invalid experiment ID"),
});

/*
 * ============================================================
 * PROJECT ID
 * ============================================================
 *
 * Used for routes such as: /projects/:projectId/experiments
 */

export const projectIdSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
});
