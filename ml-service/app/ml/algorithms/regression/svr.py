from sklearn.svm import SVR


def create_svr(
    **hyperparameters,
) -> SVR:
    return SVR(**hyperparameters)