from sklearn.ensemble import RandomForestClassifier

def create_random_forest_classifier(
        **hyperparameters,
) -> RandomForestClassifier:
    return RandomForestClassifier(**hyperparameters)