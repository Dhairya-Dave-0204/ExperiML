from sklearn.neighbors import KNeighborsClassifier


def create_knn_classifier(
    **hyperparameters,
) -> KNeighborsClassifier:
    return KNeighborsClassifier(**hyperparameters)