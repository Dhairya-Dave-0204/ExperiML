/*
 * ============================================================
 * ML Problem Types
 * ============================================================
 *
 * Represents the high-level machine learning problem category.
 *
 * Node only validates that the provided value belongs to this
 * allowed set.
 *
 * Algorithm-specific compatibility validation will be handled
 * later by the ML/Python service.
 *
 */

export const EXPERIMENT_PROBLEM_TYPES = Object.freeze({
  CLASSIFICATION: "CLASSIFICATION",

  REGRESSION: "REGRESSION",

  CLUSTERING: "CLUSTERING",

  TIME_SERIES: "TIME_SERIES",

  ANOMALY_DETECTION: "ANOMALY_DETECTION",
});

/*
 * ============================================================
 * Experiment Lifecycle Status
 * ============================================================
 *
 * Current V1 lifecycle:
 *
 * CREATED
 *     |
 *     | Future execution trigger
 *     v
 * QUEUED
 *     |
 *     v
 * TRAINING
 *     |
 *     +----------------+
 *     |                |
 *     v                v
 * COMPLETED        FAILED
 *
 * QUEUED/TRAINING/COMPLETED/FAILED/CANCELLED transitions
 * will be handled when the FastAPI execution layer exists.
 *
 * Current Node-only implementation creates experiments with:
 *
 *     CREATED
 *
 */

export const EXPERIMENT_STATUSES = Object.freeze({
  CREATED: "CREATED",

  QUEUED: "QUEUED",

  TRAINING: "TRAINING",

  COMPLETED: "COMPLETED",

  FAILED: "FAILED",

  CANCELLED: "CANCELLED",
});

/*
 * ============================================================
 * Experiment Errors
 * ============================================================
 *
 * Centralized error messages used by the Experiment service.
 *
 */

export const EXPERIMENT_ERRORS = Object.freeze({
  PROJECT_NOT_FOUND: "Project not found",

  DATASET_NOT_FOUND: "Dataset not found",

  DATASET_NOT_READY: "Dataset is not ready for experimentation",

  EXPERIMENT_NOT_FOUND: "Experiment not found",

  EXPERIMENT_UPDATE_NOT_ALLOWED:
    "Experiment execution details cannot be modified after execution starts",

  INVALID_PROBLEM_TYPE: "Invalid experiment problem type",
});
