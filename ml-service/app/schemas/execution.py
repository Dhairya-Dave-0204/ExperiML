from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel
from app.schemas.errors import ExecutionError


class ExecutionType:
    EXPERIMENT = "EXPERIMENT"
    PREDICTION = "PREDICTION"


class ExecutionStatus:
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    SUCCEEDED = "SUCCEEDED"
    FAILED = "FAILED"


class ExecutionStage:
    VALIDATION = "VALIDATION"
    DATA_LOADING = "DATA_LOADING"
    PREPROCESSING = "PREPROCESSING"
    FEATURE_ENGINEERING = "FEATURE_ENGINEERING"
    TRAINING = "TRAINING"
    EVALUATION = "EVALUATION"
    INFERENCE = "INFERENCE"
    ARTIFACT_GENERATION = "ARTIFACT_GENERATION"
    COMPLETED = "COMPLETED"


class ExecutionAcceptedResponse(BaseModel):
    execution_id: UUID
    status: Literal["QUEUED"]


class ExecutionResponse(BaseModel):
    execution_id: UUID
    status: str
    stage: str | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None
    result: dict | None = None
    error: ExecutionError | None = None