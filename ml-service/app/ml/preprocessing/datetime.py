import pandas as pd


class DatetimeProcessor:
    def convert(
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

            result[column] = pd.to_datetime(
                result[column],
                errors="raise",
            )

        return result