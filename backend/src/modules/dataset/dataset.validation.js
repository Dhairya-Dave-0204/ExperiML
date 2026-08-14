import { z } from "zod";

export const createDatasetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Dataset name must contain at least 2 characters")
    .max(255, "Dataset name cannot exceed 255 characters"),
});

export const updateDatasetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Dataset name must contain at least 2 characters")
    .max(255, "Dataset name cannot exceed 255 characters")
    .optional(),
});

export const datasetIdSchema = z.object({
  datasetId: z.string().uuid("Invalid dataset ID"),
});

export const projectIdSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
});
