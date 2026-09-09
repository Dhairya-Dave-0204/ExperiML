from sklearn.tree import DecisionTreeClassifier

from app.ml.algorithms.classification.decision_tree import (
    create_decision_tree_classifier,
)


def test_create_decision_tree_classifier():
    model = create_decision_tree_classifier()

    assert isinstance(model, DecisionTreeClassifier)


def test_create_decision_tree_classifier_with_hyperparameters():
    model = create_decision_tree_classifier(
        max_depth=5,
        random_state=42,
    )

    assert isinstance(model, DecisionTreeClassifier)
    assert model.max_depth == 5
    assert model.random_state == 42