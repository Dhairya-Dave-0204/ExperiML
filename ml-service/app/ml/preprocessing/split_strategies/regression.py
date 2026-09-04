import pandas as pd

from app.ml.preprocessing.split import DatasetSplitter, TrainTestData


class RegressionSplitStrategy:
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
        return self.splitter.split(
            features=features,
            target=target,
            test_size=self.test_size,
            random_state=self.random_state,
        )