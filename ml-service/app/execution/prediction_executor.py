from pathlib import Path
from tempfile import TemporaryDirectory
from typing import Any

import pandas as pd

from app.ml.artifacts.metadata import ArtifactMetadataBuilder
from app.ml.artifacts.model_serializer import ModelSerializer
from app.ml.artifacts.preprocessing_serializer import (
    PreprocessingPipelineSerializer,
)
from app.ml.datasets.loader import DatasetLoader
from app.schemas.artifact import ArtifactResult, ArtifactType
from app.schemas.execution import ExecutionResult
from app.schemas.prediction import (
    PredictionExecutionRequest,
    PredictionType,
)
from app.storage.base import StorageProvider


class PredictionExecutor:
    def __init__(
        self,
        dataset_loader: DatasetLoader,
        model_serializer: ModelSerializer,
        preprocessing_serializer: PreprocessingPipelineSerializer,
        metadata_builder: ArtifactMetadataBuilder,
        storage_provider: StorageProvider,
    ):
        self.dataset_loader = dataset_loader
        self.model_serializer = model_serializer
        self.preprocessing_serializer = preprocessing_serializer
        self.metadata_builder = metadata_builder
        self.storage_provider = storage_provider

    def execute(
        self,
        request: PredictionExecutionRequest,
    ) -> ExecutionResult:
        self._validate_request(request)

        prediction_input = self.dataset_loader.load(
            request.input
        )

        self._validate_input_rows(prediction_input)

        model = self._load_model(
            request.model_artifact.storage_key
        )

        preprocessing_pipeline = (
            self._load_preprocessing_pipeline(
                request.preprocessing_artifact.storage_key
            )
        )

        self._validate_input_columns(
            prediction_input,
            preprocessing_pipeline,
        )

        preprocessed_data = preprocessing_pipeline.transform(
            prediction_input
        )

        predictions = model.predict(
            preprocessed_data.features
        )

        output_dataframe = self._build_output_dataframe(
            prediction_input,
            predictions,
        )

        artifact = self._create_prediction_artifact(
            request=request,
            dataframe=output_dataframe,
        )

        rows_processed = len(prediction_input)

        return ExecutionResult(
            metrics=None,
            artifacts=[artifact],
            metadata={
                "rows_processed": rows_processed,
            },
        )

    def _validate_request(
        self,
        request: PredictionExecutionRequest,
    ) -> None:
        if request.prediction_type != PredictionType.SINGLE:
            raise ValueError(
                "Only SINGLE prediction type is supported in V1"
            )

        if request.input.file_size <= 0:
            raise ValueError(
                "Prediction input file must not be empty"
            )

    def _validate_input_rows(
        self,
        dataframe: pd.DataFrame,
    ) -> None:
        if dataframe.empty:
            raise ValueError(
                "Prediction input must contain at least one row"
            )

        if len(dataframe) != 1:
            raise ValueError(
                "SINGLE prediction requires exactly one input row"
            )

    def _load_model(
        self,
        storage_key: str,
    ) -> Any:
        if not self.storage_provider.exists(storage_key):
            raise FileNotFoundError(
                f"Model artifact not found: {storage_key}"
            )

        with self.storage_provider.open(storage_key) as source:
            data = source.read()

        with TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "model.joblib"
            path.write_bytes(data)

            return self.model_serializer.deserialize(path)

    def _load_preprocessing_pipeline(
        self,
        storage_key: str,
    ):
        if not self.storage_provider.exists(storage_key):
            raise FileNotFoundError(
                "Preprocessing pipeline artifact not found: "
                f"{storage_key}"
            )

        with self.storage_provider.open(storage_key) as source:
            data = source.read()

        with TemporaryDirectory() as temp_dir:
            path = (
                Path(temp_dir)
                / "preprocessing_pipeline.joblib"
            )
            path.write_bytes(data)

            return self.preprocessing_serializer.deserialize(
                path
            )

    def _validate_input_columns(
        self,
        dataframe: pd.DataFrame,
        preprocessing_pipeline,
    ) -> None:
        required_columns = (
            preprocessing_pipeline.numerical_columns
            + preprocessing_pipeline.categorical_columns
        )

        missing_columns = [
            column
            for column in required_columns
            if column not in dataframe.columns
        ]

        if missing_columns:
            raise ValueError(
                "Prediction input is missing required features: "
                + ", ".join(missing_columns)
            )

    def _build_output_dataframe(
        self,
        input_dataframe: pd.DataFrame,
        predictions: Any,
    ) -> pd.DataFrame:
        output_dataframe = input_dataframe.copy()

        output_dataframe["prediction"] = predictions

        return output_dataframe

    def _create_prediction_artifact(
        self,
        request: PredictionExecutionRequest,
        dataframe: pd.DataFrame,
    ) -> ArtifactResult:
        storage_key = (
            f"projects/{request.project_id}/"
            f"experiments/{request.experiment_id}/"
            f"artifacts/predictions/"
            f"{request.prediction_id}/"
            f"prediction.csv"
        )

        with TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "prediction.csv"

            dataframe.to_csv(
                path,
                index=False,
            )

            with path.open("rb") as source:
                self.storage_provider.save(
                    storage_key,
                    source,
                )

            return self.metadata_builder.build(
                file_path=path,
                artifact_name="prediction.csv",
                artifact_type=ArtifactType.PREDICTION_EXPORT,
                file_format="csv",
                original_file_name="prediction.csv",
                storage_key=storage_key,
                metadata={
                    "rows_processed": len(dataframe),
                },
            )