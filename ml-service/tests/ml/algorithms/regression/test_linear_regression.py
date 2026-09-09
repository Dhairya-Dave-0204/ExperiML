from sklearn.linear_model import LinearRegression

from app.ml.algorithms.regression.linear_regression import (
    create_linear_regression,
)


def test_create_linear_regression():
    model = create_linear_regression()

    assert isinstance(model, LinearRegression)


def test_create_linear_regression_with_hyperparameters():
    model = create_linear_regression(
        fit_intercept=False,
        positive=True,
    )

    assert isinstance(model, LinearRegression)
    assert model.fit_intercept is False
    assert model.positive is True