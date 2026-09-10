from sklearn.linear_model import Lasso


def create_lasso_regression(
    **hyperparameters,
) -> Lasso:
    return Lasso(**hyperparameters)