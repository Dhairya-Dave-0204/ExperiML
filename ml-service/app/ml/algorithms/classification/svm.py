from sklearn.svm import SVC


def create_svm_classifier(
    **hyperparameters,
) -> SVC:
    return SVC(**hyperparameters)