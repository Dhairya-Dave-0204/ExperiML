from sklearn.linear_model import LinearRegression


def create_linear_regression(
    **hyperparameters,
) -> LinearRegression:
    return LinearRegression(**hyperparameters)