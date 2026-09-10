from sklearn.tree import DecisionTreeRegressor

from app.ml.algorithms.regression.decision_tree import (
    create_decision_tree_regressor,
)


def test_create_decision_tree_regressor():
    model = create_decision_tree_regressor()

    assert isinstance(model, DecisionTreeRegressor)


def test_create_decision_tree_regressor_with_hyperparameters():
    model = create_decision_tree_regressor(
        max_depth=5,
        min_samples_split=4,
        random_state=42,
    )

    assert isinstance(model, DecisionTreeRegressor)
    assert model.max_depth == 5
    assert model.min_samples_split == 4
    assert model.random_state == 42