from enum import Enum
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class DatasetFormat(str, Enum):
    CSV = "CSV"
    XLSX = "XLSX"
    PARQUET = "PARQUET"


class ProblemType(str, Enum):
    CLASSIFICATION = "CLASSIFICATION"
    REGRESSION = "REGRESSION"
    CLUSTERING = "CLUSTERING"
    TIME_SERIES = "TIME_SERIES"
    ANOMALY_DETECTION = "ANOMALY_DETECTION"


class DatasetReference(BaseModel):
    id: UUID
    version: int
    format: DatasetFormat
    storage_key: str
    file_size: int
    mime_type: str
    checksum: str


class ExperimentConfiguration(BaseModel):
    target_column: str
    identifier_columns: list[str] = Field(default_factory=list)
    datetime_columns: list[str] = Field(default_factory=list)
    remove_duplicates: bool = False


class AlgorithmDefinition(BaseModel):
    name: str
    configuration: dict = Field(default_factory=dict)
    hyperparameters: dict = Field(default_factory=dict)


class ExperimentExecutionRequest(BaseModel):
    execution_id: UUID
    execution_type: Literal["EXPERIMENT"]
    project_id: UUID
    experiment_id: UUID
    dataset: DatasetReference
    problem_type: ProblemType
    algorithm: AlgorithmDefinition
    configuration: ExperimentConfiguration