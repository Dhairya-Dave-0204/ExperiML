from sklearn.ensemble import RandomForestClassifier

from app.ml.algorithms.classification.random_forest import (
    create_random_forest_classifier,
)


def test_create_random_forest_classifier():
    model = create_random_forest_classifier()

    assert isinstance(model, RandomForestClassifier)


def test_create_random_forest_classifier_with_hyperparameters():
    model = create_random_forest_classifier(
        n_estimators=100,
        max_depth=5,
        random_state=42,
    )

    assert isinstance(model, RandomForestClassifier)
    assert model.n_estimators == 100
    assert model.max_depth == 5
    assert model.random_state == 42