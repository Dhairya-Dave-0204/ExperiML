from sklearn.neighbors import KNeighborsRegressor

from app.ml.algorithms.regression.knn import (
    create_knn_regressor,
)


def test_create_knn_regressor():
    model = create_knn_regressor()

    assert isinstance(model, KNeighborsRegressor)


def test_create_knn_regressor_with_hyperparameters():
    model = create_knn_regressor(
        n_neighbors=5,
        weights="distance",
    )

    assert isinstance(model, KNeighborsRegressor)
    assert model.n_neighbors == 5
    assert model.weights == "distance"