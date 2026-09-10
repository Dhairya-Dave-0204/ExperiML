from sklearn.neighbors import KNeighborsRegressor


def create_knn_regressor(
    **hyperparameters,
) -> KNeighborsRegressor:
    return KNeighborsRegressor(**hyperparameters)