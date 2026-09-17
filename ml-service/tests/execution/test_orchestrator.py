from uuid import uuid4

from app.execution.orchestrator import ExecutionOrchestrator
from app.execution.manager import execution_manager
from app.schemas.artifact import ArtifactResult, ArtifactType
from app.schemas.execution import (
    ExecutionResult,
    ExecutionStage,
    ExecutionStatus,
)


class FakeExperimentExecutor:
    def __init__(self, result=None, error=None):
        self.result = result
        self.error = error

    def execute(self, request):
        if self.error:
            raise self.error

        return self.result


class FakePredictionExecutor:
    def __init__(self, result=None, error=None):
        self.result = result
        self.error = error

    def execute(self, request):
        if self.error:
            raise self.error

        return self.result


def create_orchestrator(
    experiment_result=None,
    prediction_result=None,
    experiment_error=None,
    prediction_error=None,
):
    return ExecutionOrchestrator(
        experiment_executor=FakeExperimentExecutor(
            result=experiment_result,
            error=experiment_error,
        ),
        prediction_executor=FakePredictionExecutor(
            result=prediction_result,
            error=prediction_error,
        ),
    )


def test_execute_experiment_success():
    execution_id = uuid4()

    execution_manager.create(execution_id)

    experiment_artifact = ArtifactResult(
        artifact_name="model.joblib",
        artifact_type=ArtifactType.MODEL,
        file_format="joblib",
        original_file_name="model.joblib",
        storage_key="projects/test/model.joblib",
        file_size=100,
        mime_type="application/octet-stream",
        checksum="test-checksum",
        metadata={},
    )

    experiment_result = {
        "metrics": {
            "accuracy": 0.95,
        },
        "artifacts": [
            experiment_artifact,
        ],
        "feature_names": [
            "feature_1",
            "feature_2",
        ],
    }

    orchestrator = create_orchestrator(
        experiment_result=experiment_result,
    )

    request = type(
        "ExperimentRequest",
        (),
        {
            "execution_id": execution_id,
        },
    )()

    result = orchestrator.execute_experiment(
        request
    )

    assert result.status == ExecutionStatus.SUCCEEDED
    assert result.result.metrics == {
        "accuracy": 0.95,
    }
    assert len(result.result.artifacts) == 1

    artifact = result.result.artifacts[0]

    assert artifact.artifact_name == "model.joblib"
    assert artifact.artifact_type == ArtifactType.MODEL

    assert result.result.metadata == {
        "feature_names": [
            "feature_1",
            "feature_2",
        ],
    }


def test_execute_experiment_failure():
    execution_id = uuid4()

    execution_manager.create(execution_id)

    orchestrator = create_orchestrator(
        experiment_error=ValueError(
            "Training failed"
        ),
    )

    request = type(
        "ExperimentRequest",
        (),
        {
            "execution_id": execution_id,
        },
    )()

    result = orchestrator.execute_experiment(
        request
    )

    assert result.status == ExecutionStatus.FAILED
    assert result.error is not None
    assert result.error.code == "EXECUTION_FAILED"
    assert result.error.message == "Training failed"


def test_execute_prediction_success():
    execution_id = uuid4()

    execution_manager.create(execution_id)

    prediction_result = ExecutionResult(
        metrics=None,
        artifacts=[],
        metadata={
            "rows_processed": 1,
        },
    )

    orchestrator = create_orchestrator(
        prediction_result=prediction_result,
    )

    request = type(
        "PredictionRequest",
        (),
        {
            "execution_id": execution_id,
        },
    )()

    result = orchestrator.execute_prediction(
        request
    )

    assert result.status == ExecutionStatus.SUCCEEDED
    assert result.result.metrics is None
    assert result.result.artifacts == []
    assert result.result.metadata == {
        "rows_processed": 1,
    }


def test_execute_prediction_failure():
    execution_id = uuid4()

    execution_manager.create(execution_id)

    orchestrator = create_orchestrator(
        prediction_error=ValueError(
            "Prediction failed"
        ),
    )

    request = type(
        "PredictionRequest",
        (),
        {
            "execution_id": execution_id,
        },
    )()

    result = orchestrator.execute_prediction(
        request
    )

    assert result.status == ExecutionStatus.FAILED
    assert result.error is not None
    assert result.error.code == "EXECUTION_FAILED"
    assert result.error.message == "Prediction failed"


def test_execute_experiment_sets_running_before_execution():
    execution_id = uuid4()

    execution_manager.create(execution_id)

    experiment_result = {
        "metrics": {},
        "artifacts": [],
        "feature_names": [],
    }

    orchestrator = create_orchestrator(
        experiment_result=experiment_result,
    )

    request = type(
        "ExperimentRequest",
        (),
        {
            "execution_id": execution_id,
        },
    )()

    result = orchestrator.execute_experiment(
        request
    )

    assert result.status == ExecutionStatus.SUCCEEDED
    assert result.started_at is not None


def test_execute_prediction_sets_running_before_execution():
    execution_id = uuid4()

    execution_manager.create(execution_id)

    prediction_result = ExecutionResult(
        metrics=None,
        artifacts=[],
        metadata={
            "rows_processed": 1,
        },
    )

    orchestrator = create_orchestrator(
        prediction_result=prediction_result,
    )

    request = type(
        "PredictionRequest",
        (),
        {
            "execution_id": execution_id,
        },
    )()

    result = orchestrator.execute_prediction(
        request
    )

    assert result.status == ExecutionStatus.SUCCEEDED
    assert result.started_at is not None


def test_get_current_stage_returns_current_stage():
    execution_id = uuid4()

    execution_manager.create(execution_id)
    execution_manager.set_running(execution_id)
    execution_manager.set_stage(
        execution_id,
        ExecutionStage.INFERENCE,
    )

    orchestrator = create_orchestrator()

    stage = orchestrator._get_current_stage(
        execution_id
    )

    assert stage == ExecutionStage.INFERENCE


def test_get_current_stage_returns_none_for_missing_execution():
    orchestrator = create_orchestrator()

    stage = orchestrator._get_current_stage(
        uuid4()
    )

    assert stage is None