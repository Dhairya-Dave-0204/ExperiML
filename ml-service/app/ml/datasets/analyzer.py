import pandas as pd

from app.schemas.dataset import ColumnAnalysis, DatasetAnalysis
from app.schemas.experiment import DatasetFormat


class DatasetAnalyzer:
    def analyze(
        self,
        dataframe: pd.DataFrame,
        dataset_format: DatasetFormat,
    ) -> DatasetAnalysis:
        row_count, column_count = dataframe.shape

        duplicate_row_count = int(dataframe.duplicated().sum())

        duplicate_row_percentage = (
            (duplicate_row_count / row_count) * 100
            if row_count > 0
            else 0.0
        )

        columns = [
            self._analyze_column(dataframe, column_name)
            for column_name in dataframe.columns
        ]

        return DatasetAnalysis(
            row_count=row_count,
            column_count=column_count,
            format=dataset_format,
            duplicate_row_count=duplicate_row_count,
            duplicate_row_percentage=duplicate_row_percentage,
            columns=columns,
        )

    def _analyze_column(
        self,
        dataframe: pd.DataFrame,
        column_name: str,
    ) -> ColumnAnalysis:
        column = dataframe[column_name]

        non_null_count = int(column.notna().sum())
        missing_count = int(column.isna().sum())
        row_count = len(dataframe)

        missing_percentage = (
            (missing_count / row_count) * 100
            if row_count > 0
            else 0.0
        )

        unique_count = int(column.nunique(dropna=True))

        return ColumnAnalysis(
            name=str(column_name),
            data_type=str(column.dtype),
            non_null_count=non_null_count,
            missing_count=missing_count,
            missing_percentage=missing_percentage,
            unique_count=unique_count,
        )