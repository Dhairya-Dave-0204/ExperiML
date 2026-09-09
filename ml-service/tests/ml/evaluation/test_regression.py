import numpy as np
import pandas as pd
import pytest
from sklearn.linear_model import LinearRegression

from app.ml.evaluation.regression import (
    RegressionEvaluator,
)


def create_trained_model():
    X_train = pd.DataFrame(
        {
            "feature": [
                1,
                2,
                3,
                4,
                5,
            ],
        }
    )

    y_train = pd.Series(
        [
            2,
            4,
            6,
            8,
            10,
        ]
    )

    model = LinearRegression()

    model.fit(
        X_train,
        y_train,
    )

    return model


def create_test_data():
    X_test = pd.DataFrame(
        {
            "feature": [
                6,
                7,
            ],
        }
    )

    y_test = pd.Series(
        [
            12,
            14,
        ]
    )

    return X_test, y_test


def test_regression_evaluator_returns_all_metrics():
    model = create_trained_model()

    X_test, y_test = create_test_data()

    evaluator = RegressionEvaluator()

    metrics = evaluator.evaluate(
        model=model,
        X_test=X_test,
        y_test=y_test,
    )

    assert "r2" in metrics
    assert "mae" in metrics
    assert "mse" in metrics
    assert "rmse" in metrics
    assert "rmsle" in metrics


def test_regression_metrics_are_floats():
    model = create_trained_model()

    X_test, y_test = create_test_data()

    evaluator = RegressionEvaluator()

    metrics = evaluator.evaluate(
        model=model,
        X_test=X_test,
        y_test=y_test,
    )

    for metric in [
        "r2",
        "mae",
        "mse",
        "rmse",
        "rmsle",
    ]:
        assert isinstance(
            metrics[metric],
            float,
        )


def test_regression_evaluator_calculates_metrics_correctly():
    model = create_trained_model()

    X_test, y_test = create_test_data()

    evaluator = RegressionEvaluator()

    metrics = evaluator.evaluate(
        model=model,
        X_test=X_test,
        y_test=y_test,
    )

    assert metrics["r2"] == 1.0
    assert metrics["mae"] == 0.0
    assert metrics["mse"] == 0.0
    assert metrics["rmse"] == 0.0
    assert metrics["rmsle"] == 0.0


def test_regression_evaluator_rejects_negative_targets():
    model = create_trained_model()

    X_test = pd.DataFrame(
        {
            "feature": [
                6,
                7,
            ],
        }
    )

    y_test = pd.Series(
        [
            -12,
            14,
        ]
    )

    evaluator = RegressionEvaluator()

    with pytest.raises(
        ValueError,
        match=(
            "RMSLE requires non-negative "
            "target values"
        ),
    ):
        evaluator.evaluate(
            model=model,
            X_test=X_test,
            y_test=y_test,
        )


def test_regression_evaluator_rejects_negative_predictions():
    class NegativePredictionModel:
        def predict(self, X):
            return np.array(
                [
                    -5.0,
                    10.0,
                ]
            )

    model = NegativePredictionModel()

    X_test = pd.DataFrame(
        {
            "feature": [
                6,
                7,
            ],
        }
    )

    y_test = pd.Series(
        [
            12,
            14,
        ]
    )

    evaluator = RegressionEvaluator()

    with pytest.raises(
        ValueError,
        match=(
            "RMSLE requires non-negative "
            "predictions"
        ),
    ):
        evaluator.evaluate(
            model=model,
            X_test=X_test,
            y_test=y_test,
        )