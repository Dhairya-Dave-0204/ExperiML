from sklearn.linear_model import LogisticRegression

from app.ml.algorithms.classification.logistic_regression import (
    create_logistic_regression,
)


def test_create_logistic_regression():
    model = create_logistic_regression()

    assert isinstance(model, LogisticRegression)


def test_create_logistic_regression_with_hyperparameters():
    model = create_logistic_regression(
        C=0.5,
        max_iter=1000,
    )

    assert isinstance(model, LogisticRegression)
    assert model.C == 0.5
    assert model.max_iter == 1000