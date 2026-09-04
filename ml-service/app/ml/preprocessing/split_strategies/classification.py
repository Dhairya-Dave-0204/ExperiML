import pandas as pd

from app.ml.preprocessing.split import TrainTestData


class ClassificationSplitStrategy:
    def __init__(
        self,
        test_size: float = 0.2,
        random_state: int = 42,
    ):
        self.test_size = test_size
        self.random_state = random_state

    def split(
        self,
        features: pd.DataFrame,
        target: pd.Series,
    ) -> TrainTestData:
        self._validate_target(target)

        X_train, X_test, y_train, y_test = (
            self._stratified_split(
                features,
                target,
            )
        )

        return TrainTestData(
            X_train=X_train,
            X_test=X_test,
            y_train=y_train,
            y_test=y_test,
        )

    def _stratified_split(
        self,
        features: pd.DataFrame,
        target: pd.Series,
    ):
        from sklearn.model_selection import train_test_split

        return train_test_split(
            features,
            target,
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