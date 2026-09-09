from sklearn.neighbors import KNeighborsClassifier

from app.ml.algorithms.classification.knn import (
    create_knn_classifier,
)


def test_create_knn_classifier():
    model = create_knn_classifier()

    assert isinstance(model, KNeighborsClassifier)


def test_create_knn_classifier_with_hyperparameters():
    model = create_knn_classifier(
        n_neighbors=5,
        weights="distance",
    )

    assert isinstance(model, KNeighborsClassifier)
    assert model.n_neighbors == 5
    assert model.weights == "distance"