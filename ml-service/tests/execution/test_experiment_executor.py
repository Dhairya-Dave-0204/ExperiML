from uuid import uuid4

import pandas as pd

from app.execution.experiment_executor import ExperimentExecutor
from app.execution.manager import execution_manager
from app.ml.algorithms.registry import algorithm_registry
from app.ml.artifacts.generator import ModelArtifactGenerator
from app.ml.artifacts.metadata import ArtifactMetadataBuilder
from app.ml.artifacts.model_serializer import ModelSerializer
from app.ml.artifacts.preprocessing_serializer import (
    PreprocessingPipelineSerializer,
)
from app.ml.datasets.loader import DatasetLoader
from app.ml.evaluation.evaluator import evaluator_selector
from app.ml.preprocessing.column_roles import ColumnRoleResolver
from app.ml.preprocessing.datetime import DatetimeProcessor
from app.ml.preprocessing.datetime_features import (
    DatetimeFeatureExtractor,
)
from app.ml.preprocessing.features import FeatureTargetSplitter
from app.ml.preprocessing.split_strategies.selector import (
    SplitStrategySelector,
)
from app.ml.training.trainer import ModelTrainer
from app.schemas.artifact import ArtifactType
from app.schemas.execution import (
    ExecutionStage,
    ExecutionStatus,
)
from app.schemas.experiment import (
    AlgorithmDefinition,
    DatasetFormat,
    DatasetReference,
    ExperimentConfiguration,
    ExperimentExecutionRequest,
    ProblemType,
)
from app.storage.local import LocalStorageProvider


def create_dataset(tmp_path):
    dataframe = pd.DataFrame(
        {
            "age": [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            "income": [
                30000,
                32000,
                34000,
                36000,
                38000,
                40000,
                42000,
                44000,
                46000,
                48000,
            ],
            "city": [
                "A",
                "A",
                "B",
                "B",
                "A",
                "B",
                "A",
                "B",
                "A",
                "B",
            ],
            "target": [
                0,
                0,
                0,
                0,
                0,
                1,
                1,
                1,
                1,
                1,
            ],
        }
    )

    storage_key = "datasets/test.csv"

    file_path = tmp_path / storage_key
    file_path.parent.mkdir(parents=True, exist_ok=True)

    dataframe.to_csv(file_path, index=False)

    return DatasetReference(
        id=uuid4(),
        version=1,
        format=DatasetFormat.CSV,
        storage_key=storage_key,
        file_size=file_path.stat().st_size,
        mime_type="text/csv",
        checksum="test-checksum",
    )


def create_request(tmp_path):
    return ExperimentExecutionRequest(
        execution_id=uuid4(),
        execution_type="EXPERIMENT",
        project_id=uuid4(),
        experiment_id=uuid4(),
        dataset=create_dataset(tmp_path),
        problem_type=ProblemType.CLASSIFICATION,
        algorithm=AlgorithmDefinition(
            name="logistic_regression",
            hyperparameters={
                "max_iter": 1000,
            },
        ),
        configuration=ExperimentConfiguration(
            target_column="target",
        ),
    )


def create_executor(tmp_path):
    storage_provider = LocalStorageProvider(tmp_path)

    dataset_loader = DatasetLoader(
        storage_provider=storage_provider,
    )

    artifact_generator = ModelArtifactGenerator(
        serializer=ModelSerializer(),
        preprocessing_serializer=PreprocessingPipelineSerializer(),
        metadata_builder=ArtifactMetadataBuilder(),
        storage_provider=storage_provider,
    )

    return ExperimentExecutor(
        dataset_loader=dataset_loader,
        role_resolver=ColumnRoleResolver(),
        datetime_processor=DatetimeProcessor(),
        datetime_feature_extractor=DatetimeFeatureExtractor(),
        feature_target_splitter=FeatureTargetSplitter(),
        split_strategy_selector=SplitStrategySelector(),
        model_trainer=ModelTrainer(),
        artifact_generator=artifact_generator,
    )


def test_prepare_returns_processed_data(tmp_path):
    request = create_request(tmp_path)

    execution_manager.create(
        request.execution_id
    )

    executor = create_executor(tmp_path)

    prepared_data = executor.prepare(request)

    assert prepared_data.X_train is not None
    assert prepared_data.X_test is not None

    assert prepared_data.y_train is not None
    assert prepared_data.y_test is not None

    assert prepared_data.feature_names

    assert (
        prepared_data.preprocessing_pipeline
        is not None
    )


def test_prepare_splits_data_correctly(tmp_path):
    request = create_request(tmp_path)

    execution_manager.create(
        request.execution_id
    )

    executor = create_executor(tmp_path)

    prepared_data = executor.prepare(request)

    total_rows = (
        len(prepared_data.y_train)
        + len(prepared_data.y_test)
    )

    assert total_rows == 10

    assert len(prepared_data.y_train) == 8
    assert len(prepared_data.y_test) == 2


def test_prepare_fits_preprocessing_pipeline(
    tmp_path,
):
    request = create_request(tmp_path)

    execution_manager.create(
        request.execution_id
    )

    executor = create_executor(tmp_path)

    prepared_data = executor.prepare(request)

    assert (
        prepared_data.preprocessing_pipeline._is_fitted
        is True
    )


def test_execute_trains_and_evaluates_model(
    tmp_path,
):
    request = create_request(tmp_path)

    execution_manager.create(
        request.execution_id
    )

    execution_manager.set_running(
        request.execution_id
    )

    executor = create_executor(tmp_path)

    result = executor.execute(request)

    assert result["model"] is not None
    assert result["metrics"] is not None

    assert "accuracy" in result["metrics"]
    assert "precision" in result["metrics"]
    assert "recall" in result["metrics"]
    assert "f1" in result["metrics"]

    assert result["feature_names"]

    assert (
        result["preprocessing_pipeline"]
        is not None
    )


def test_execute_generates_both_artifacts(
    tmp_path,
):
    request = create_request(tmp_path)

    execution_manager.create(
        request.execution_id
    )

    execution_manager.set_running(
        request.execution_id
    )

    executor = create_executor(tmp_path)

    result = executor.execute(request)

    artifacts = result["artifacts"]

    assert len(artifacts) == 2

    artifact_types = {
        artifact.artifact_type
        for artifact in artifacts
    }

    assert ArtifactType.MODEL in artifact_types

    assert (
        ArtifactType.PREPROCESSING_PIPELINE
        in artifact_types
    )

    for artifact in artifacts:
        stored_file = tmp_path / artifact.storage_key

        assert stored_file.exists()
        assert stored_file.is_file()

        assert artifact.file_size > 0
        assert artifact.checksum