from enum import Enum

from pydantic import BaseModel


class ArtifactType(str, Enum):
    MODEL = "MODEL"
    PREPROCESSING_PIPELINE = "PREPROCESSING_PIPELINE"
    REPORT = "REPORT"
    PREDICTION_EXPORT = "PREDICTION_EXPORT"
    FEATURE_IMPORTANCE = "FEATURE_IMPORTANCE"
    VISUALIZATION = "VISUALIZATION"
    OTHER = "OTHER"


class ArtifactResult(BaseModel):
    artifact_name: str
    artifact_type: ArtifactType
    file_format: str
    original_file_name: str
    storage_key: str
    file_size: int
    mime_type: str
    checksum: str
    metadata: dict | None = None