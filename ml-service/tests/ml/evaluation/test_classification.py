import pandas as pd
from sklearn.linear_model import LogisticRegression

from app.ml.evaluation.classification import (
    ClassificationEvaluator,
)


def test_classification_evaluator_returns_metrics():
    X_test = pd.DataFrame(
        {
            "feature": [1, 2, 3, 4],
        }
    )

    y_test = pd.Series(
        [0, 0, 1, 1]
    )

    model = LogisticRegression(
        max_iter=1000,
    )

    model.fit(
        X_test,
        y_test,
    )

    evaluator = ClassificationEvaluator()

    metrics = evaluator.evaluate(
        model=model,
        X_test=X_test,
        y_test=y_test,
    )

    assert set(metrics.keys()) == {
        "accuracy",
        "precision",
        "recall",
        "f1",
    }

    assert metrics["accuracy"] == 1.0
    assert metrics["precision"] == 1.0
    assert metrics["recall"] == 1.0
    assert metrics["f1"] == 1.0