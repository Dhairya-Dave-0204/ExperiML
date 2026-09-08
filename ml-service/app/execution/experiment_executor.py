import pandas as pd

from app.execution.manager import execution_manager
from app.ml.algorithms.registry import algorithm_registry
from app.ml.datasets.loader import DatasetLoader
from app.ml.evaluation.evaluator import evaluator_selector
from app.ml.preprocessing.column_roles import ColumnRoleResolver
from app.ml.preprocessing.datetime import DatetimeProcessor
from app.ml.preprocessing.datetime_features import DatetimeFeatureExtractor
from app.ml.preprocessing.features import FeatureTargetSplitter
from app.ml.preprocessing.pipeline import PreprocessingPipeline
from app.ml.preprocessing.split import TrainTestData
from app.ml.preprocessing.split_strategies.selector import (
    SplitStrategySelector,
)
from app.ml.training.trainer import ModelTrainer
from app.schemas.execution import ExecutionStage
from app.schemas.experiment import ExperimentExecutionRequest


class PreparedExperimentData:
    def __init__(
        self,
        X_train: object,
        X_test: object,
        y_train: pd.Series,
        y_test: pd.Series,
        feature_names: list[str],
        preprocessing_pipeline: PreprocessingPipeline,
    ):
        self.X_train = X_train
        self.X_test = X_test
        self.y_train = y_train
        self.y_test = y_test
        self.feature_names = feature_names
        self.preprocessing_pipeline = preprocessing_pipeline


class ExperimentExecutor:
    def __init__(
        self,
        dataset_loader: DatasetLoader,
        role_resolver: ColumnRoleResolver,
        datetime_processor: DatetimeProcessor,
        datetime_feature_extractor: DatetimeFeatureExtractor,
        feature_target_splitter: FeatureTargetSplitter,
        split_strategy_selector: SplitStrategySelector,
        model_trainer: ModelTrainer,
    ):
        self.dataset_loader = dataset_loader
        self.role_resolver = role_resolver
        self.datetime_processor = datetime_processor
        self.datetime_feature_extractor = datetime_feature_extractor
        self.feature_target_splitter = feature_target_splitter
        self.split_strategy_selector = split_strategy_selector
        self.model_trainer = model_trainer

    def prepare(
        self,
        request: ExperimentExecutionRequest,
    ) -> PreparedExperimentData:
        execution_id = request.execution_id

        execution_manager.set_stage(
            execution_id,
            ExecutionStage.DATA_LOADING,
        )

        dataframe = self.dataset_loader.load(
            request.dataset
        )

        execution_manager.set_stage(
            execution_id,
            ExecutionStage.VALIDATION,
        )

        roles = self.role_resolver.resolve(
            dataframe=dataframe,
            target_column=request.configuration.target_column,
            identifier_columns=request.configuration.identifier_columns,
            datetime_columns=request.configuration.datetime_columns,
        )

        if roles.datetime:
            dataframe = self.datetime_processor.convert(
                dataframe=dataframe,
                columns=roles.datetime,
            )

            dataframe = self.datetime_feature_extractor.extract(
                dataframe=dataframe,
                columns=roles.datetime,
            )

            roles = self.role_resolver.resolve(
                dataframe=dataframe,
                target_column=roles.target,
                identifier_columns=roles.identifiers,
            )

        execution_manager.set_stage(
            execution_id,
            ExecutionStage.PREPROCESSING,
        )

        feature_target_data = self.feature_target_splitter.split(
            dataframe=dataframe,
            target_column=roles.target,
            feature_columns=roles.features,
        )

        split_strategy = self.split_strategy_selector.select(
            request.problem_type,
        )

        split_data: TrainTestData = split_strategy.split(
            features=feature_target_data.features,
            target=feature_target_data.target,
        )

        numerical_columns = split_data.X_train.select_dtypes(
            include="number"
        ).columns.tolist()

        categorical_columns = split_data.X_train.select_dtypes(
            include=["object", "category", "bool"]
        ).columns.tolist()

        preprocessing_pipeline = PreprocessingPipeline(
            numerical_columns=numerical_columns,
            categorical_columns=categorical_columns,
        )

        preprocessing_pipeline.fit(
            split_data.X_train
        )

        X_train_processed = preprocessing_pipeline.transform(
            split_data.X_train
        )

        X_test_processed = preprocessing_pipeline.transform(
            split_data.X_test
        )

        return PreparedExperimentData(
            X_train=X_train_processed.features,
            X_test=X_test_processed.features,
            y_train=split_data.y_train,
            y_test=split_data.y_test,
            feature_names=X_train_processed.feature_names,
            preprocessing_pipeline=preprocessing_pipeline,
        )

    def execute(
        self,
        request: ExperimentExecutionRequest,
    ):
        prepared_data = self.prepare(request)

        execution_manager.set_stage(
            request.execution_id,
            ExecutionStage.TRAINING,
        )

        model = algorithm_registry.create(
            problem_type=request.problem_type,
            name=request.algorithm.name,
            **request.algorithm.hyperparameters,
        )

        trained_model = self.model_trainer.train(
            model=model,
            X_train=prepared_data.X_train,
            y_train=prepared_data.y_train,
        )

        execution_manager.set_stage(
            request.execution_id,
            ExecutionStage.EVALUATION,
        )

        evaluator = evaluator_selector.select(
            request.problem_type,
        )

        metrics = evaluator.evaluate(
            model=trained_model,
            X_test=prepared_data.X_test,
            y_test=prepared_data.y_test,
        )

        return {
            "model": trained_model,
            "metrics": metrics,
            "feature_names": prepared_data.feature_names,
            "preprocessing_pipeline": prepared_data.preprocessing_pipeline,
        }