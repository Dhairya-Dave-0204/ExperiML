from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class PredictionType(str, Enum):
    SINGLE = "SINGLE"
    BATCH = "BATCH"


class PredictionInputReference(BaseModel):
    id: UUID
    format: str
    storage_key: str
    file_size: int
    mime_type: str
    checksum: str


class ModelArtifactReference(BaseModel):
    id: UUID
    storage_key: str
    file_format: str
    checksum: str


class PredictionExecutionRequest(BaseModel):
    execution_id: UUID
    execution_type: str
    project_id: UUID
    experiment_id: UUID
    prediction_id: UUID
    prediction_type: PredictionType
    input: PredictionInputReference
    model_artifact: ModelArtifactReference