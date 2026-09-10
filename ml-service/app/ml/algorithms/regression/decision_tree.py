from sklearn.tree import DecisionTreeRegressor


def create_decision_tree_regressor(
    **hyperparameters,
) -> DecisionTreeRegressor:
    return DecisionTreeRegressor(**hyperparameters)