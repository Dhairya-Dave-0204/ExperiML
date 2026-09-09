from sklearn.naive_bayes import GaussianNB


def create_naive_bayes_classifier(
    **hyperparameters,
) -> GaussianNB:
    return GaussianNB(**hyperparameters)