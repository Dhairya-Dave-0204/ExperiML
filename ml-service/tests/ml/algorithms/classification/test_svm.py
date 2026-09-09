from sklearn.svm import SVC

from app.ml.algorithms.classification.svm import (
    create_svm_classifier,
)


def test_create_svm_classifier():
    model = create_svm_classifier()

    assert isinstance(model, SVC)


def test_create_svm_classifier_with_hyperparameters():
    model = create_svm_classifier(
        C=2.0,
        kernel="linear",
        random_state=42,
    )

    assert isinstance(model, SVC)
    assert model.C == 2.0
    assert model.kernel == "linear"
    assert model.random_state == 42