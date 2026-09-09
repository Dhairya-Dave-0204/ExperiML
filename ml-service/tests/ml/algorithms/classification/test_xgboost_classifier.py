from xgboost import XGBClassifier

from app.ml.algorithms.classification.xgboost_classifier import (
    create_xgboost_classifier,
)


def test_create_xgboost_classifier():
    model = create_xgboost_classifier()

    assert isinstance(model, XGBClassifier)


def test_create_xgboost_classifier_with_hyperparameters():
    model = create_xgboost_classifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        random_state=42,
    )

    assert isinstance(model, XGBClassifier)
    assert model.n_estimators == 100
    assert model.max_depth == 5
    assert model.learning_rate == 0.1
    assert model.random_state == 42