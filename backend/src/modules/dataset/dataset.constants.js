export const DATASET_FORMATS = Object.freeze({
  CSV: "CSV",
  XLSX: "XLSX",
  PARQUET: "PARQUET",
});

export const DATASET_STATUSES = Object.freeze({
  UPLOADING: "UPLOADING",
  PROCESSING: "PROCESSING",
  READY: "READY",
  FAILED: "FAILED",
});

export const ALLOWED_DATASET_EXTENSIONS = Object.freeze({
  CSV: ".csv",
  XLSX: ".xlsx",
  PARQUET: ".parquet",
});

export const DATASET_METADATA_CONFIG = Object.freeze({
  /*
   * Number of rows used for
   * datatype inference.
   *
   * Used by Node parser V1.
   */
  SAMPLE_SIZE: 10,
});

export const DATASET_ERRORS = Object.freeze({
  INVALID_FORMAT: "Unsupported dataset format",
  FILE_REQUIRED: "Dataset file is required",
  PROCESSING_FAILED: "Dataset processing failed",
  STORAGE_FAILED: "Dataset storage failed",
});
