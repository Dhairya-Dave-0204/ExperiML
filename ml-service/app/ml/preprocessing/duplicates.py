import pandas as pd


class DuplicateHandler:
    def remove_duplicates(
        self,
        dataframe: pd.DataFrame,
    ) -> pd.DataFrame:
        return dataframe.drop_duplicates()