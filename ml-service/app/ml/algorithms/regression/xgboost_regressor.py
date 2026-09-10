from xgboost import XGBRegressor


def create_xgboost_regressor(
    **hyperparameters,
) -> XGBRegressor:
    return XGBRegressor(**hyperparameters)