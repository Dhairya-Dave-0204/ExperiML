from dataclasses import dataclass

import pandas as pd


@dataclass
class CleanedTargetData:
    features: pd.DataFrame
    target: pd.Series
    removed_row_count: int


class TargetHandler:
    def remove_missing_target(
        self,
        features: pd.DataFrame,
        target: pd.Series,
    ) -> CleanedTargetData:
        self._validate_inputs(
            features,
            target,
        )

        valid_target_mask = target.notna()

        cleaned_features = features.loc[
            valid_target_mask
        ].copy()

        cleaned_target = target.loc[
            valid_target_mask
        ].copy()

        removed_row_count = int(
            (~valid_target_mask).sum()
        )

        return CleanedTargetData(
            features=cleaned_features,
            target=cleaned_target,
            removed_row_count=removed_row_count,
        )

    def _validate_inputs(
        self,
        features: pd.DataFrame,
        target: pd.Series,
    ) -> None:
        if len(features) != len(target):
            raise ValueError(
                "Features and target must contain the same "
                "number of rows"
            )

        if len(features) == 0:
            raise ValueError(
                "Features and target cannot be empty"
            )