from sklearn.linear_model import LogisticRegression


def create_logistic_regression(**hyperparameters) -> LogisticRegression:
    return LogisticRegression(**hyperparameters)