from sklearn.ensemble import RandomForestRegressor


def create_random_forest_regressor(
    **hyperparameters,
) -> RandomForestRegressor:
    return RandomForestRegressor(**hyperparameters)