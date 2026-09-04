from dataclasses import dataclass

import pandas as pd
from sklearn.model_selection import train_test_split


@dataclass
class TrainTestData:
    X_train: pd.DataFrame
    X_test: pd.DataFrame
    y_train: pd.Series
    y_test: pd.Series


class DatasetSplitter:
    def split(
        self,
        features: pd.DataFrame,
        target: pd.Series,
        test_size: float = 0.2,
        random_state: int = 42,
    ) -> TrainTestData:
        self._validate_inputs(
            features,
            target,
            test_size,
        )

        X_train, X_test, y_train, y_test = train_test_split(
            features,
            target,
            test_size=test_size,
            random_state=random_state,
        )

        return TrainTestData(
            X_train=X_train,
            X_test=X_test,
            y_train=y_train,
            y_test=y_test,
        )

    def _validate_inputs(
        self,
        features: pd.DataFrame,
        target: pd.Series,
        test_size: float,
    ) -> None:
        if len(features) != len(target):
            raise ValueError(
                "Features and target must contain the same number of rows"
            )

        if len(features) == 0:
            raise ValueError(
                "Features and target cannot be empty"
            )

        if not 0 < test_size < 1:
            raise ValueError(
                "test_size must be between 0 and 1"
            )