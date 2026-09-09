from sklearn.naive_bayes import GaussianNB

from app.ml.algorithms.classification.naive_bayes import (
    create_naive_bayes_classifier,
)


def test_create_naive_bayes_classifier():
    model = create_naive_bayes_classifier()

    assert isinstance(model, GaussianNB)


def test_create_naive_bayes_classifier_with_hyperparameters():
    model = create_naive_bayes_classifier(
        var_smoothing=1e-8,
    )

    assert isinstance(model, GaussianNB)
    assert model.var_smoothing == 1e-8