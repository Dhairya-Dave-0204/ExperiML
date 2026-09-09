from uuid import uuid4

import pandas as pd

from app.execution.experiment_executor import (
    ExperimentExecutor,
)
from app.execution.manager import execution_manager
from app.execution.orchestrator import (
    ExecutionOrchestrator,
)
from app.ml.artifacts.generator import (
    ModelArtifactGenerator,
)
from app.ml.artifacts.metadata import (
    ArtifactMetadataBuilder,
)
from app.ml.artifacts.model_serializer import (
    ModelSerializer,
)
from app.ml.artifacts.preprocessing_serializer import (
    PreprocessingPipelineSerializer,
)
from app.ml.datasets.loader import DatasetLoader
from app.ml.preprocessing.column_roles import (
    ColumnRoleResolver,
)
from app.ml.preprocessing.datetime import (
    DatetimeProcessor,
)
from app.ml.preprocessing.datetime_features import (
    DatetimeFeatureExtractor,
)
from app.ml.preprocessing.features import (
    FeatureTargetSplitter,
)
from app.ml.preprocessing.split_strategies.selector import (
    SplitStrategySelector,
)
from app.ml.training.trainer import ModelTrainer
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
            "age": [
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
            ],
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
    file_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    dataframe.to_csv(
        file_path,
        index=False,
    )

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


def create_orchestrator(tmp_path):
    storage_provider = LocalStorageProvider(
        tmp_path
    )

    dataset_loader = DatasetLoader(
        storage_provider=storage_provider,
    )

    artifact_generator = ModelArtifactGenerator(
        serializer=ModelSerializer(),
        preprocessing_serializer=(
            PreprocessingPipelineSerializer()
        ),
        metadata_builder=(
            ArtifactMetadataBuilder()
        ),
        storage_provider=storage_provider,
    )

    experiment_executor = ExperimentExecutor(
        dataset_loader=dataset_loader,
        role_resolver=ColumnRoleResolver(),
        datetime_processor=DatetimeProcessor(),
        datetime_feature_extractor=(
            DatetimeFeatureExtractor()
        ),
        feature_target_splitter=(
            FeatureTargetSplitter()
        ),
        split_strategy_selector=(
            SplitStrategySelector()
        ),
        model_trainer=ModelTrainer(),
        artifact_generator=artifact_generator,
    )

    return ExecutionOrchestrator(
        experiment_executor=experiment_executor,
    )


def test_successful_execution_updates_state(
    tmp_path,
):
    request = create_request(tmp_path)

    execution_manager.create(
        request.execution_id
    )

    orchestrator = create_orchestrator(
        tmp_path
    )

    state = orchestrator.execute_experiment(
        request
    )

    assert (
        state.status
        == ExecutionStatus.SUCCEEDED
    )

    assert (
        state.stage
        == ExecutionStage.COMPLETED
    )

    assert state.started_at is not None
    assert state.completed_at is not None

    assert state.result is not None

    assert state.result.metrics is not None

    assert len(
        state.result.artifacts
    ) == 2

    assert state.error is None


def test_failed_execution_updates_state(
    tmp_path,
):
    request = create_request(tmp_path)

    request.dataset = DatasetReference(
        id=request.dataset.id,
        version=request.dataset.version,
        format=request.dataset.format,
        storage_key="datasets/missing.csv",
        file_size=request.dataset.file_size,
        mime_type=request.dataset.mime_type,
        checksum=request.dataset.checksum,
    )

    execution_manager.create(
        request.execution_id
    )

    orchestrator = create_orchestrator(
        tmp_path
    )

    state = orchestrator.execute_experiment(
        request
    )

    assert (
        state.status
        == ExecutionStatus.FAILED
    )

    assert state.completed_at is not None

    assert state.error is not None

    assert (
        state.error.code
        == "EXECUTION_FAILED"
    )

    assert (
        state.error.stage
        == ExecutionStage.DATA_LOADING
    )

    assert state.result is None