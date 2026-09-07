from typing import Any

import pandas as pd


class ModelTrainer:
    def train(
        self,
        model: Any,
        X_train: Any,
        y_train: pd.Series,
    ) -> Any:
        model.fit(
            X_train,
            y_train,
        )

        return model