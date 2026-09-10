from sklearn.linear_model import Ridge


def create_ridge_regression(
    **hyperparameters,
) -> Ridge:
    return Ridge(**hyperparameters)