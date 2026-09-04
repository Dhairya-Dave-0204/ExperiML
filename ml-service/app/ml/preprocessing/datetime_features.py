import pandas as pd


class DatetimeFeatureExtractor:
    def extract(
        self,
        dataframe: pd.DataFrame,
        columns: list[str],
    ) -> pd.DataFrame:
        result = dataframe.copy()

        for column in columns:
            if column not in result.columns:
                raise ValueError(
                    f"Datetime column not found in dataframe: {column}"
                )

            if not pd.api.types.is_datetime64_any_dtype(
                result[column]
            ):
                raise ValueError(
                    f"Column is not a datetime column: {column}"
                )

            result[f"{column}_year"] = result[column].dt.year
            result[f"{column}_month"] = result[column].dt.month
            result[f"{column}_day"] = result[column].dt.day
            result[f"{column}_day_of_week"] = (
                result[column].dt.dayofweek
            )
            result[f"{column}_is_weekend"] = (
                result[column].dt.dayofweek >= 5
            )

            result = result.drop(columns=[column])

        return result