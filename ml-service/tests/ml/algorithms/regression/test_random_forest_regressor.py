from sklearn.ensemble import RandomForestRegressor

from app.ml.algorithms.regression.random_forest import (
    create_random_forest_regressor,
)


def test_create_random_forest_regressor():
    model = create_random_forest_regressor()

    assert isinstance(model, RandomForestRegressor)


def test_create_random_forest_regressor_with_hyperparameters():
    model = create_random_forest_regressor(
        n_estimators=100,
        max_depth=5,
        random_state=42,
    )

    assert isinstance(model, RandomForestRegressor)
    assert model.n_estimators == 100
    assert model.max_depth == 5
    assert model.random_state == 42