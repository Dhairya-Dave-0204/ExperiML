import pandas as pd

from app.ml.preprocessing.split import DatasetSplitter, TrainTestData


class ClassificationSplitStrategy:
    def __init__(
        self,
        test_size: float = 0.2,
        random_state: int = 42,
    ):
        self.test_size = test_size
        self.random_state = random_state
        self.splitter = DatasetSplitter()

    def split(
        self,
        features: pd.DataFrame,
        target: pd.Series,
    ) -> TrainTestData:
        self._validate_target(target)

        return self.splitter.split(
            features=features,
            target=target,
            test_size=self.test_size,
            random_state=self.random_state,
            stratify=target,
        )

    def _validate_target(
        self,
        target: pd.Series,
    ) -> None:
        if target.empty:
            raise ValueError(
                "Classification target cannot be empty"
            )

        if target.nunique() < 2:
            raise ValueError(
                "Classification target must contain "
                "at least two classes"
            )