export const ARTIFACT_TYPES = {
  MODEL: "MODEL",
  PREPROCESSING_PIPELINE: "PREPROCESSING_PIPELINE",
  REPORT: "REPORT",
  PREDICTION_EXPORT: "PREDICTION_EXPORT",
  FEATURE_IMPORTANCE: "FEATURE_IMPORTANCE",
  VISUALIZATION: "VISUALIZATION",
  OTHER: "OTHER",
};

export const ARTIFACT_STATUS = {
  GENERATING: "GENERATING",
  AVAILABLE: "AVAILABLE",
  FAILED: "FAILED",
};

export const ARTIFACT_MESSAGES = {
  ARTIFACT_CREATED: "Artifact created successfully.",
  ARTIFACT_FETCHED: "Artifact fetched successfully.",
  ARTIFACTS_FETCHED: "Artifacts fetched successfully.",
  ARTIFACT_DELETED: "Artifact deleted successfully.",

  ARTIFACT_NOT_FOUND: "Artifact not found.",
  ARTIFACT_NOT_AVAILABLE: "Artifact is not available for download.",
};
