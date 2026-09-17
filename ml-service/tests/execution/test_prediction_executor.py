from io import BytesIO
from uuid import uuid4

import pandas as pd
import pytest

from app.execution.prediction_executor import PredictionExecutor
from app.ml.artifacts.metadata import ArtifactMetadataBuilder
from app.schemas.artifact import ArtifactType
from app.schemas.execution import ExecutionResult
from app.schemas.experiment import DatasetFormat
from app.schemas.prediction import (
    ModelArtifactReference,
    PredictionExecutionRequest,
    PredictionInputReference,
    PredictionType,
    PreprocessingArtifactReference,
)


class FakeStorageProvider:
    def __init__(self):
        self.files = {}

    def exists(self, storage_key: str) -> bool:
        return storage_key in self.files

    def open(self, storage_key: str):
        if storage_key not in self.files:
            raise FileNotFoundError(storage_key)

        return BytesIO(self.files[storage_key])

    def save(self, storage_key: str, source) -> None:
        self.files[storage_key] = source.read()

    def delete(self, storage_key: str) -> None:
        self.files.pop(storage_key, None)


class FakeDatasetLoader:
    def __init__(self, dataframe: pd.DataFrame):
        self.dataframe = dataframe

    def load(self, dataset) -> pd.DataFrame:
        return self.dataframe.copy()


class FakeModel:
    def __init__(self, prediction):
        self.prediction = prediction

    def predict(self, features):
        return [self.prediction]


class FakeModelSerializer:
    def __init__(self, model):
        self.model = model

    def deserialize(self, input_path):
        return self.model


class FakePreprocessingSerializer:
    def __init__(self, preprocessing_pipeline):
        self.preprocessing_pipeline = preprocessing_pipeline

    def deserialize(self, input_path):
        return self.preprocessing_pipeline


class FakePreprocessingPipeline:
    numerical_columns = ["age"]
    categorical_columns = ["gender"]

    def transform(self, dataframe):
        class Result:
            features = dataframe[["age", "gender"]].copy()

        return Result()


def create_request(
    prediction_type=PredictionType.SINGLE,
    file_size=100,
):
    return PredictionExecutionRequest(
        execution_id=uuid4(),
        execution_type="PREDICTION",
        project_id=uuid4(),
        experiment_id=uuid4(),
        prediction_id=uuid4(),
        prediction_type=prediction_type,
        input=PredictionInputReference(
            id=uuid4(),
            format=DatasetFormat.CSV,
            storage_key="prediction-input.csv",
            file_size=file_size,
            mime_type="text/csv",
            checksum="input-checksum",
        ),
        model_artifact=ModelArtifactReference(
            id=uuid4(),
            storage_key="model.joblib",
            file_format="joblib",
            checksum="model-checksum",
        ),
        preprocessing_artifact=PreprocessingArtifactReference(
            id=uuid4(),
            storage_key="preprocessing_pipeline.joblib",
            file_format="joblib",
            checksum="pipeline-checksum",
        ),
    )


def create_executor(dataframe):
    storage_provider = FakeStorageProvider()

    storage_provider.files["model.joblib"] = b"model"
    storage_provider.files[
        "preprocessing_pipeline.joblib"
    ] = b"pipeline"

    dataset_loader = FakeDatasetLoader(dataframe)

    model_serializer = FakeModelSerializer(
        FakeModel(prediction=1)
    )

    preprocessing_serializer = FakePreprocessingSerializer(
        FakePreprocessingPipeline()
    )

    return (
        PredictionExecutor(
            prediction_input_loader=dataset_loader,
            model_serializer=model_serializer,
            preprocessing_serializer=preprocessing_serializer,
            metadata_builder=ArtifactMetadataBuilder(),
            artifact_storage_provider=storage_provider,
        ),
        storage_provider,
    )


def test_execute_single_prediction_returns_result():
    dataframe = pd.DataFrame(
        [
            {
                "age": 45,
                "gender": "M",
            }
        ]
    )

    executor, storage_provider = create_executor(dataframe)

    request = create_request()

    result = executor.execute(request)

    assert isinstance(result, ExecutionResult)
    assert result.metrics is None
    assert len(result.artifacts) == 1

    artifact = result.artifacts[0]

    assert artifact.artifact_name == "prediction.csv"
    assert artifact.artifact_type == ArtifactType.PREDICTION_EXPORT
    assert artifact.file_format == "csv"
    assert artifact.metadata["rows_processed"] == 1

    assert (
        artifact.storage_key
        in storage_provider.files
    )


def test_execute_creates_prediction_csv_with_prediction_column():
    dataframe = pd.DataFrame(
        [
            {
                "age": 45,
                "gender": "M",
            }
        ]
    )

    executor, storage_provider = create_executor(dataframe)

    request = create_request()

    result = executor.execute(request)

    artifact = result.artifacts[0]

    csv_bytes = storage_provider.files[
        artifact.storage_key
    ]

    output = pd.read_csv(BytesIO(csv_bytes))

    assert list(output.columns) == [
        "age",
        "gender",
        "prediction",
    ]

    assert output.iloc[0]["age"] == 45
    assert output.iloc[0]["gender"] == "M"
    assert output.iloc[0]["prediction"] == 1


def test_execute_reports_processed_rows():
    dataframe = pd.DataFrame(
        [
            {
                "age": 45,
                "gender": "M",
            }
        ]
    )

    executor, _ = create_executor(dataframe)

    result = executor.execute(
        create_request()
    )

    assert result.metadata == {
        "rows_processed": 1,
    }


def test_single_prediction_rejects_multiple_rows():
    dataframe = pd.DataFrame(
        [
            {
                "age": 45,
                "gender": "M",
            },
            {
                "age": 50,
                "gender": "F",
            },
        ]
    )

    executor, _ = create_executor(dataframe)

    with pytest.raises(
        ValueError,
        match="SINGLE prediction requires exactly one input row",
    ):
        executor.execute(create_request())


def test_prediction_rejects_empty_input():
    dataframe = pd.DataFrame(
        columns=["age", "gender"]
    )

    executor, _ = create_executor(dataframe)

    with pytest.raises(
        ValueError,
        match="Prediction input must contain at least one row",
    ):
        executor.execute(create_request())


def test_prediction_rejects_batch_prediction():
    dataframe = pd.DataFrame(
        [
            {
                "age": 45,
                "gender": "M",
            }
        ]
    )

    executor, _ = create_executor(dataframe)

    request = create_request(
        prediction_type=PredictionType.BATCH
    )

    with pytest.raises(
        ValueError,
        match="Only SINGLE prediction type is supported in V1",
    ):
        executor.execute(request)


def test_prediction_rejects_empty_input_file():
    dataframe = pd.DataFrame(
        [
            {
                "age": 45,
                "gender": "M",
            }
        ]
    )

    executor, _ = create_executor(dataframe)

    request = create_request(file_size=0)

    with pytest.raises(
        ValueError,
        match="Prediction input file must not be empty",
    ):
        executor.execute(request)


def test_prediction_rejects_missing_required_feature():
    dataframe = pd.DataFrame(
        [
            {
                "age": 45,
            }
        ]
    )

    executor, _ = create_executor(dataframe)

    with pytest.raises(
        ValueError,
        match="Prediction input is missing required features",
    ):
        executor.execute(create_request())


def test_prediction_rejects_missing_model_artifact():
    dataframe = pd.DataFrame(
        [
            {
                "age": 45,
                "gender": "M",
            }
        ]
    )

    executor, storage_provider = create_executor(dataframe)

    del storage_provider.files["model.joblib"]

    with pytest.raises(
        FileNotFoundError,
        match="Model artifact not found",
    ):
        executor.execute(create_request())


def test_prediction_rejects_missing_preprocessing_artifact():
    dataframe = pd.DataFrame(
        [
            {
                "age": 45,
                "gender": "M",
            }
        ]
    )

    executor, storage_provider = create_executor(dataframe)

    del storage_provider.files[
        "preprocessing_pipeline.joblib"
    ]

    with pytest.raises(
        FileNotFoundError,
        match="Preprocessing pipeline artifact not found",
    ):
        executor.execute(create_request())