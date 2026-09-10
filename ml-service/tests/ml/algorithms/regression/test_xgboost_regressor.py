from xgboost import XGBRegressor

from app.ml.algorithms.regression.xgboost_regressor import (
    create_xgboost_regressor,
)


def test_create_xgboost_regressor():
    model = create_xgboost_regressor()

    assert isinstance(model, XGBRegressor)


def test_create_xgboost_regressor_with_hyperparameters():
    model = create_xgboost_regressor(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        random_state=42,
    )

    assert isinstance(model, XGBRegressor)
    assert model.n_estimators == 100
    assert model.max_depth == 5
    assert model.learning_rate == 0.1
    assert model.random_state == 42