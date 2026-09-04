from dataclasses import dataclass

import pandas as pd


@dataclass
class FeatureTargetData:
    features: pd.DataFrame
    target: pd.Series


class FeatureTargetSplitter:
    def split(
        self,
        dataframe: pd.DataFrame,
        target_column: str,
        feature_columns: list[str],
    ) -> FeatureTargetData:
        self._validate_columns(
            dataframe,
            target_column,
            feature_columns,
        )

        features = dataframe[feature_columns].copy()
        target = dataframe[target_column].copy()

        return FeatureTargetData(
            features=features,
            target=target,
        )

    def _validate_columns(
        self,
        dataframe: pd.DataFrame,
        target_column: str,
        feature_columns: list[str],
    ) -> None:
        if target_column not in dataframe.columns:
            raise ValueError(
                f"Target column not found in dataframe: "
                f"{target_column}"
            )

        missing_features = [
            column
            for column in feature_columns
            if column not in dataframe.columns
        ]

        if missing_features:
            raise ValueError(
                "Feature columns not found in dataframe: "
                f"{missing_features}"
            )

        if target_column in feature_columns:
            raise ValueError(
                "Target column cannot also be a feature column"
            )