from dataclasses import dataclass

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


@dataclass
class PreprocessedData:
    features: object
    feature_names: list[str]


class PreprocessingPipeline:
    def __init__(
        self,
        numerical_columns: list[str],
        categorical_columns: list[str],
    ):
        self.numerical_columns = numerical_columns
        self.categorical_columns = categorical_columns
        self.pipeline = self._build_pipeline()
        self._is_fitted = False

    def _build_pipeline(self) -> ColumnTransformer:
        numerical_pipeline = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler()),
            ]
        )

        categorical_pipeline = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy="most_frequent")),
                (
                    "encoder",
                    OneHotEncoder(
                        handle_unknown="ignore",
                        sparse_output=False,
                    ),
                ),
            ]
        )

        return ColumnTransformer(
            transformers=[
                (
                    "numerical",
                    numerical_pipeline,
                    self.numerical_columns,
                ),
                (
                    "categorical",
                    categorical_pipeline,
                    self.categorical_columns,
                ),
            ],
            remainder="drop",
        )

    def fit(
        self,
        dataframe: pd.DataFrame,
    ) -> None:
        self.pipeline.fit(dataframe)
        self._is_fitted = True

    def transform(
        self,
        dataframe: pd.DataFrame,
    ) -> PreprocessedData:
        self._validate_fitted()

        features = self.pipeline.transform(dataframe)

        return PreprocessedData(
            features=features,
            feature_names=self._get_feature_names(),
        )

    def fit_transform(
        self,
        dataframe: pd.DataFrame,
    ) -> PreprocessedData:
        self.fit(dataframe)

        return self.transform(dataframe)

    def _get_feature_names(self) -> list[str]:
        return list(
            self.pipeline.get_feature_names_out()
        )

    def _validate_fitted(self) -> None:
        if not self._is_fitted:
            raise RuntimeError(
                "Preprocessing pipeline must be fitted before transform"
            )