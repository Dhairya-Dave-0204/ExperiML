from dataclasses import dataclass

import pandas as pd


@dataclass
class ColumnTypes:
    numerical: list[str]
    categorical: list[str]


class ColumnTypeDetector:
    def detect(self, dataframe: pd.DataFrame) -> ColumnTypes:
        numerical_columns = dataframe.select_dtypes(
            include="number"
        ).columns.tolist()

        categorical_columns = dataframe.select_dtypes(
            include=["object", "category", "bool"]
        ).columns.tolist()

        return ColumnTypes(
            numerical=numerical_columns,
            categorical=categorical_columns,
        )