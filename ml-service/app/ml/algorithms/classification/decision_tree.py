from sklearn.tree import DecisionTreeClassifier


def create_decision_tree_classifier(
    **hyperparameters,
) -> DecisionTreeClassifier:
    return DecisionTreeClassifier(**hyperparameters)