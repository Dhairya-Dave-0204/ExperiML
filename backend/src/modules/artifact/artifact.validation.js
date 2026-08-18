import { z } from "zod";

/**
 * Validate project and experiment route parameters.
 * Used for:
 * GET /projects/:projectId/experiments/:experimentId/artifacts
 */
export const artifactParentParamsSchema = z.object({
  projectId: z.string().uuid("Invalid project ID format."),
  experimentId: z.string().uuid("Invalid experiment ID format."),
});

/**
 * Validate project, experiment, and artifact route parameters.
 * Used for:
 * GET    /projects/:projectId/experiments/:experimentId/artifacts/:artifactId
 * GET    /projects/:projectId/experiments/:experimentId/artifacts/:artifactId/download
 * DELETE /projects/:projectId/experiments/:experimentId/artifacts/:artifactId
 */
export const artifactParamsSchema = artifactParentParamsSchema.extend({
  artifactId: z.string().uuid("Invalid artifact ID format."),
});
