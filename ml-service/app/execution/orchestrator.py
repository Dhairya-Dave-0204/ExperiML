from app.execution.experiment_executor import ExperimentExecutor
from app.execution.manager import execution_manager
from app.schemas.errors import ExecutionError
from app.schemas.execution import (
    ExecutionResult,
    ExecutionStatus,
)
from app.schemas.experiment import ExperimentExecutionRequest


class ExecutionOrchestrator:
    def __init__(
        self,
        experiment_executor: ExperimentExecutor,
    ):
        self.experiment_executor = experiment_executor

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