from typing import Any

from pydantic import BaseModel, Field

from app.schemas.experiment import DatasetFormat


class ColumnAnalysis(BaseModel):
    name: str
    data_type: str
    non_null_count: int
    missing_count: int
    missing_percentage: float
    unique_count: int


class DatasetAnalysis(BaseModel):
    row_count: int
    column_count: int
    format: DatasetFormat
    duplicate_row_count: int
    duplicate_row_percentage: float
    columns: list[ColumnAnalysis] = Field(default_factory=list)
    statistics: dict[str, Any] = Field(default_factory=dict)