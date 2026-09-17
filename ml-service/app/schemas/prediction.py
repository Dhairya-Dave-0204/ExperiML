from enum import Enum
from typing import Literal
from uuid import UUID

from pydantic import BaseModel

from app.schemas.experiment import DatasetFormat


class PredictionType(str, Enum):
    SINGLE = "SINGLE"
    BATCH = "BATCH"


class PredictionInputReference(BaseModel):
    id: UUID
    format: DatasetFormat
    storage_key: str
    file_size: int
    mime_type: str
    checksum: str


class ModelArtifactReference(BaseModel):
    id: UUID
    storage_key: str
    file_format: str
    checksum: str


class PreprocessingArtifactReference(BaseModel):
    id: UUID
    storage_key: str
    file_format: str
    checksum: str


class PredictionExecutionRequest(BaseModel):
    execution_id: UUID
    execution_type: Literal["PREDICTION"]
    project_id: UUID
    experiment_id: UUID
    prediction_id: UUID
    prediction_type: PredictionType
    input: PredictionInputReference
    model_artifact: ModelArtifactReference
    preprocessing_artifact: PreprocessingArtifactReference