from app.execution.experiment_executor import ExperimentExecutor
from app.execution.prediction_executor import PredictionExecutor
from app.execution.manager import execution_manager
from app.schemas.errors import ExecutionError
from app.schemas.execution import (
    ExecutionResult,
    ExecutionStatus,
)
from app.schemas.experiment import ExperimentExecutionRequest
from app.schemas.prediction import PredictionExecutionRequest


class ExecutionOrchestrator:
    def __init__(
        self,
        experiment_executor: ExperimentExecutor,
        prediction_executor: PredictionExecutor,
    ):
        self.experiment_executor = experiment_executor
        self.prediction_executor = prediction_executor

    def execute_experiment(
        self,
        request: ExperimentExecutionRequest,
    ):
        execution_id = request.execution_id

        execution_manager.set_running(
            execution_id
        )

        try:
            result = self.experiment_executor.execute(
                request
            )

            execution_result = ExecutionResult(
                metrics=result["metrics"],
                artifacts=result["artifacts"],
                metadata={
                    "feature_names": result["feature_names"],
                },
            )

            return execution_manager.complete(
                execution_id=execution_id,
                result=execution_result,
            )

        except Exception as exc:
            error = ExecutionError(
                code="EXECUTION_FAILED",
                message=str(exc),
                stage=self._get_current_stage(
                    execution_id
                ),
            )

            return execution_manager.fail(
                execution_id=execution_id,
                error=error,
            )

    def execute_prediction(
        self,
        request: PredictionExecutionRequest,
    ):
        execution_id = request.execution_id

        execution_manager.set_running(
            execution_id
        )

        try:
            result = self.prediction_executor.execute(
                request
            )

            return execution_manager.complete(
                execution_id=execution_id,
                result=result,
            )

        except Exception as exc:
            error = ExecutionError(
                code="EXECUTION_FAILED",
                message=str(exc),
                stage=self._get_current_stage(
                    execution_id
                ),
            )

            return execution_manager.fail(
                execution_id=execution_id,
                error=error,
            )

    def _get_current_stage(
        self,
        execution_id,
    ) -> str | None:
        state = execution_manager.get(
            execution_id
        )

        if state is None:
            return None

        return state.stage