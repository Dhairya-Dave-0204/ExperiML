from xgboost import XGBClassifier


def create_xgboost_classifier(
    **hyperparameters,
) -> XGBClassifier:
    return XGBClassifier(**hyperparameters)