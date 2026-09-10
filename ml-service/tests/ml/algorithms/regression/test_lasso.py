from sklearn.linear_model import Lasso

from app.ml.algorithms.regression.lasso import (
    create_lasso_regression,
)


def test_create_lasso_regression():
    model = create_lasso_regression()

    assert isinstance(model, Lasso)


def test_create_lasso_regression_with_hyperparameters():
    model = create_lasso_regression(
        alpha=0.5,
        fit_intercept=False,
        max_iter=2000,
    )

    assert isinstance(model, Lasso)
    assert model.alpha == 0.5
    assert model.fit_intercept is False
    assert model.max_iter == 2000