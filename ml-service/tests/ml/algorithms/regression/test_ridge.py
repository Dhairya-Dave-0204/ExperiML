from sklearn.linear_model import Ridge

from app.ml.algorithms.regression.ridge import (
    create_ridge_regression,
)


def test_create_ridge_regression():
    model = create_ridge_regression()

    assert isinstance(model, Ridge)


def test_create_ridge_regression_with_hyperparameters():
    model = create_ridge_regression(
        alpha=2.0,
        fit_intercept=False,
    )

    assert isinstance(model, Ridge)
    assert model.alpha == 2.0
    assert model.fit_intercept is False