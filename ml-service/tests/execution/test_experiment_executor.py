from uuid import uuid4

import pandas as pd

from app.execution.experiment_executor import ExperimentExecutor
from app.execution.manager import execution_manager
from app.ml.preprocessing.column_roles import ColumnRoleResolver
from app.ml.preprocessing.datetime import DatetimeProcessor
from app.ml.preprocessing.datetime_features import DatetimeFeatureExtractor
from app.ml.preprocessing.features import FeatureTargetSplitter
from app.ml.preprocessing.split_strategies.selector import (
    SplitStrategySelector,
)
from app.ml.training.trainer import ModelTrainer
from app.schemas.experiment import (
    AlgorithmDefinition,
    DatasetFormat,
    DatasetReference,
    ExperimentConfiguration,
    ExperimentExecutionRequest,
    ProblemType,
)


class FakeDatasetLoader:
    def __init__(self, dataframe: pd.DataFrame):
        self.dataframe = dataframe

    def load(self, dataset: DatasetReference) -> pd.DataFrame:
        return self.dataframe.copy()


def create_executor(dataframe: pd.DataFrame) -> ExperimentExecutor:
    return ExperimentExecutor(
        dataset_loader=FakeDatasetLoader(dataframe),
        role_resolver=ColumnRoleResolver(),
        datetime_processor=DatetimeProcessor(),
        datetime_feature_extractor=DatetimeFeatureExtractor(),
        feature_target_splitter=FeatureTargetSplitter(),
        split_strategy_selector=SplitStrategySelector(),
        model_trainer=ModelTrainer(),
    )


def create_request(
    problem_type: ProblemType,
    target_column: str,
) -> ExperimentExecutionRequest:
    request = ExperimentExecutionRequest(
        execution_id=uuid4(),
        execution_type="EXPERIMENT",
        project_id=uuid4(),
        experiment_id=uuid4(),
        dataset=DatasetReference(
            id=uuid4(),
            version=1,
            format=DatasetFormat.CSV,
            storage_key="test/dataset.csv",
            file_size=100,
            mime_type="text/csv",
            checksum="test-checksum",
        ),
        problem_type=problem_type,
        algorithm=AlgorithmDefinition(
            name="test-algorithm",
        ),
        configuration=ExperimentConfiguration(
            target_column=target_column,
        ),
    )

    execution_manager.create(request.execution_id)

    return request


def test_prepare_classification():
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

    executor = create_executor(dataframe)

    request = create_request(
        problem_type=ProblemType.CLASSIFICATION,
        target_column="target",
    )

    result = executor.prepare(request)

    assert len(result.X_train) == 8
    assert len(result.X_test) == 2

    assert len(result.y_train) == 8
    assert len(result.y_test) == 2

    assert set(result.y_train.unique()) == {0, 1}
    assert set(result.y_test.unique()) == {0, 1}

    assert result.X_train.shape[1] == result.X_test.shape[1]
    assert len(result.feature_names) == result.X_train.shape[1]

    assert result.preprocessing_pipeline._is_fitted is True


def test_prepare_regression():
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
                100,
                120,
                140,
                160,
                180,
                200,
                220,
                240,
                260,
                280,
            ],
        }
    )

    executor = create_executor(dataframe)

    request = create_request(
        problem_type=ProblemType.REGRESSION,
        target_column="target",
    )

    result = executor.prepare(request)

    assert len(result.X_train) == 8
    assert len(result.X_test) == 2

    assert len(result.y_train) == 8
    assert len(result.y_test) == 2

    assert result.X_train.shape[1] == result.X_test.shape[1]
    assert len(result.feature_names) == result.X_train.shape[1]

    assert result.preprocessing_pipeline._is_fitted is True


def test_prepare_with_datetime_column():
    dataframe = pd.DataFrame(
        {
            "age": [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            "created_at": [
                "2026-01-01",
                "2026-01-02",
                "2026-01-03",
                "2026-01-04",
                "2026-01-05",
                "2026-01-06",
                "2026-01-07",
                "2026-01-08",
                "2026-01-09",
                "2026-01-10",
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

    executor = create_executor(dataframe)

    request = create_request(
        problem_type=ProblemType.CLASSIFICATION,
        target_column="target",
    )

    request.configuration.datetime_columns = ["created_at"]

    result = executor.prepare(request)

    assert len(result.X_train) == 8
    assert len(result.X_test) == 2

    assert len(result.y_train) == 8
    assert len(result.y_test) == 2

    assert result.X_train.shape[1] == result.X_test.shape[1]

    assert any(
        "created_at_year" in feature_name
        for feature_name in result.feature_names
    )

    assert any(
        "created_at_month" in feature_name
        for feature_name in result.feature_names
    )

    assert any(
        "created_at_day_of_week" in feature_name
        for feature_name in result.feature_names
    )


def test_prepare_excludes_identifier_column():
    dataframe = pd.DataFrame(
        {
            "id": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            "age": [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
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

    executor = create_executor(dataframe)

    request = create_request(
        problem_type=ProblemType.CLASSIFICATION,
        target_column="target",
    )

    request.configuration.identifier_columns = ["id"]

    result = executor.prepare(request)

    assert len(result.X_train) == 8
    assert len(result.X_test) == 2

    assert not any(
        feature_name.endswith("__id")
        for feature_name in result.feature_names
    )


def test_execute_classification_with_logistic_regression():
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

    executor = create_executor(dataframe)

    request = create_request(
        problem_type=ProblemType.CLASSIFICATION,
        target_column="target",
    )

    request.algorithm.name = "logistic_regression"
    request.algorithm.hyperparameters = {
        "max_iter": 1000,
    }

    result = executor.execute(request)

    assert result["model"] is not None

    assert set(result["metrics"].keys()) == {
        "accuracy",
        "precision",
        "recall",
        "f1",
    }

    assert 0 <= result["metrics"]["accuracy"] <= 1
    assert 0 <= result["metrics"]["precision"] <= 1
    assert 0 <= result["metrics"]["recall"] <= 1
    assert 0 <= result["metrics"]["f1"] <= 1

    assert len(result["feature_names"]) == result["model"].n_features_in_

    assert result["preprocessing_pipeline"]._is_fitted is True