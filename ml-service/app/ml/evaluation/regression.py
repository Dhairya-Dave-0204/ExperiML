from typing import Any

import numpy as np
import pandas as pd
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    mean_squared_log_error,
    r2_score,
)


class RegressionEvaluator:
    def evaluate(
        self,
        model: Any,
        X_test: Any,
        y_test: pd.Series,
    ) -> dict[str, float]:
        predictions = model.predict(X_test)

        self._validate_rmsle_inputs(
            y_test=y_test,
            predictions=predictions,
        )

        mse = mean_squared_error(
            y_test,
            predictions,
        )

        return {
            "r2": float(
                r2_score(
                    y_test,
                    predictions,
                )
            ),
            "mae": float(
                mean_absolute_error(
                    y_test,
                    predictions,
                )
            ),
            "mse": float(mse),
            "rmse": float(
                np.sqrt(mse)
            ),
            "rmsle": float(
                np.sqrt(
                    mean_squared_log_error(
                        y_test,
                        predictions,
                    )
                )
            ),
        }

    def _validate_rmsle_inputs(
        self,
        y_test: pd.Series,
        predictions: Any,
    ) -> None:
        if (y_test < 0).any():
            raise ValueError(
                "RMSLE requires non-negative target values"
            )

        if (predictions < 0).any():
            raise ValueError(
                "RMSLE requires non-negative predictions"
            )