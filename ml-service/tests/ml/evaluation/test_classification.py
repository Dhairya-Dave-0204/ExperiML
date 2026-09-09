import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression

from app.ml.evaluation.classification import (
    ClassificationEvaluator,
)


def create_trained_model():
    X_train = pd.DataFrame(
        {
            "feature_1": [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
            ],
            "feature_2": [
                10,
                20,
                30,
                40,
                50,
                60,
                70,
                80,
            ],
        }
    )

    y_train = pd.Series(
        [
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
        ]
    )

    model = LogisticRegression(
        max_iter=1000
    )

    model.fit(
        X_train,
        y_train,
    )

    return model


def create_test_data():
    X_test = pd.DataFrame(
        {
            "feature_1": [
                1.5,
                2.5,
                6.5,
                7.5,
            ],
            "feature_2": [
                15,
                25,
                65,
                75,
            ],
        }
    )

    y_test = pd.Series(
        [
            0,
            0,
            1,
            1,
        ]
    )

    return X_test, y_test


def test_classification_evaluator_returns_basic_metrics():
    model = create_trained_model()

    X_test, y_test = create_test_data()

    evaluator = ClassificationEvaluator()

    metrics = evaluator.evaluate(
        model=model,
        X_test=X_test,
        y_test=y_test,
    )

    assert "accuracy" in metrics
    assert "precision" in metrics
    assert "recall" in metrics
    assert "f1" in metrics

    assert isinstance(
        metrics["accuracy"],
        float,
    )

    assert isinstance(
        metrics["precision"],
        float,
    )

    assert isinstance(
        metrics["recall"],
        float,
    )

    assert isinstance(
        metrics["f1"],
        float,
    )


def test_classification_evaluator_returns_confusion_matrix():
    model = create_trained_model()

    X_test, y_test = create_test_data()

    evaluator = ClassificationEvaluator()

    metrics = evaluator.evaluate(
        model=model,
        X_test=X_test,
        y_test=y_test,
    )

    confusion = metrics[
        "confusion_matrix"
    ]

    assert isinstance(
        confusion,
        list,
    )

    assert len(confusion) == 2
    assert len(confusion[0]) == 2
    assert len(confusion[1]) == 2

    assert confusion == [
        [2, 0],
        [0, 2],
    ]


def test_classification_evaluator_returns_classification_report():
    model = create_trained_model()

    X_test, y_test = create_test_data()

    evaluator = ClassificationEvaluator()

    metrics = evaluator.evaluate(
        model=model,
        X_test=X_test,
        y_test=y_test,
    )

    report = metrics[
        "classification_report"
    ]

    assert isinstance(
        report,
        dict,
    )

    assert "0" in report
    assert "1" in report
    assert "accuracy" in report
    assert "macro avg" in report
    assert "weighted avg" in report

    assert isinstance(
        report["0"],
        dict,
    )

    assert "precision" in report["0"]
    assert "recall" in report["0"]
    assert "f1-score" in report["0"]
    assert "support" in report["0"]


def test_classification_metrics_are_json_friendly():
    model = create_trained_model()

    X_test, y_test = create_test_data()

    evaluator = ClassificationEvaluator()

    metrics = evaluator.evaluate(
        model=model,
        X_test=X_test,
        y_test=y_test,
    )

    assert isinstance(
        metrics["confusion_matrix"],
        list,
    )

    assert all(
        isinstance(row, list)
        for row in metrics["confusion_matrix"]
    )

    report = metrics[
        "classification_report"
    ]

    assert isinstance(
        report,
        dict,
    )

    for class_metrics in report.values():
        if isinstance(class_metrics, dict):
            for value in class_metrics.values():
                assert isinstance(
                    value,
                    (int, float),
                )

        else:
            assert isinstance(
                class_metrics,
                (int, float),
            )