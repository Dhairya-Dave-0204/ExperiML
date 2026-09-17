from pathlib import Path

from app.core.config import settings
from app.core.security import verify_internal_service_key
from app.execution.experiment_executor import ExperimentExecutor
from app.execution.orchestrator import ExecutionOrchestrator
from app.ml.artifacts.generator import ModelArtifactGenerator
from app.ml.artifacts.metadata import ArtifactMetadataBuilder
from app.ml.artifacts.model_serializer import ModelSerializer
from app.ml.artifacts.preprocessing_serializer import ( PreprocessingPipelineSerializer )
from app.ml.datasets.loader import DatasetLoader
from app.ml.preprocessing.column_roles import ColumnRoleResolver
from app.ml.preprocessing.datetime import DatetimeProcessor
from app.ml.preprocessing.datetime_features import ( DatetimeFeatureExtractor )
from app.ml.preprocessing.features import FeatureTargetSplitter
from app.ml.preprocessing.split_strategies.selector import ( SplitStrategySelector )
from app.ml.training.trainer import ModelTrainer
from app.storage.local import LocalStorageProvider
from app.ml.preprocessing.duplicates import DuplicateHandler
from app.ml.preprocessing.target import TargetHandler
from app.execution.prediction_executor import PredictionExecutor


internal_service_auth = verify_internal_service_key


def get_execution_orchestrator() -> ExecutionOrchestrator:
    dataset_storage_provider = LocalStorageProvider(
        settings.uploads_root
    )

    artifact_storage_provider = LocalStorageProvider(
        Path(settings.storage_root) / "artifacts"
    )

    dataset_loader = DatasetLoader(
        storage_provider=dataset_storage_provider,
    )

    artifact_generator = ModelArtifactGenerator(
        serializer=ModelSerializer(),
        preprocessing_serializer=(
            PreprocessingPipelineSerializer()
        ),
        metadata_builder=ArtifactMetadataBuilder(),
        storage_provider=artifact_storage_provider,
    )

    duplicate_handler = DuplicateHandler()

    experiment_executor = ExperimentExecutor(
        dataset_loader=dataset_loader,
        role_resolver=ColumnRoleResolver(),
        datetime_processor=DatetimeProcessor(),
        datetime_feature_extractor=DatetimeFeatureExtractor(),
        feature_target_splitter=FeatureTargetSplitter(),
        target_handler=TargetHandler(),
        split_strategy_selector=SplitStrategySelector(),
        model_trainer=ModelTrainer(),
        artifact_generator=artifact_generator,
        duplicate_handler=duplicate_handler,
    )

    return ExecutionOrchestrator(
        experiment_executor=experiment_executor,
    )


def get_prediction_executor() -> PredictionExecutor:
    prediction_input_storage_provider = LocalStorageProvider(
        Path(settings.storage_root) / "predictions"
    )

    artifact_storage_provider = LocalStorageProvider(
        Path(settings.storage_root) / "artifacts"
    )

    prediction_input_loader = DatasetLoader(
        storage_provider=prediction_input_storage_provider,
    )

    return PredictionExecutor(
        prediction_input_loader=prediction_input_loader,
        model_serializer=ModelSerializer(),
        preprocessing_serializer=(
            PreprocessingPipelineSerializer()
        ),
        metadata_builder=ArtifactMetadataBuilder(),
        artifact_storage_provider=artifact_storage_provider,
    )