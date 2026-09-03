from datetime import datetime
from uuid import UUID

from app.execution.state import (
    ExecutionState,
    execution_state_store,
)
from app.schemas.errors import ExecutionError
from app.schemas.execution import (
    ExecutionResult,
    ExecutionStage,
    ExecutionStatus,
)


class ExecutionManager:
    _ALLOWED_TRANSITIONS = {
        ExecutionStatus.QUEUED: {
            ExecutionStatus.RUNNING,
        },
        ExecutionStatus.RUNNING: {
            ExecutionStatus.SUCCEEDED,
            ExecutionStatus.FAILED,
        },  
        ExecutionStatus.SUCCEEDED: set(),
        ExecutionStatus.FAILED: set(),
    }

    def create(self, execution_id: UUID) -> ExecutionState:
        return execution_state_store.create(execution_id)

    def get(self, execution_id: UUID) -> ExecutionState | None:
        return execution_state_store.get(execution_id)

    def set_running(self, execution_id: UUID) -> ExecutionState:
        state = self._get_required(execution_id)

        self._transition(
            state,
            ExecutionStatus.RUNNING,
        )

        state.started_at = datetime.now()

        return state

    def set_stage(
        self,
        execution_id: UUID,
        stage: str,
    ) -> ExecutionState:
        state = self._get_required(execution_id)

        state.stage = stage

        return state

    def complete(
        self,
        execution_id: UUID,
        result: ExecutionResult | None = None,
    ) -> ExecutionState:
        state = self._get_required(execution_id)

        self._transition(
            state,
            ExecutionStatus.SUCCEEDED,
        )

        state.stage = ExecutionStage.COMPLETED
        state.completed_at = datetime.now()
        state.result = result
        state.error = None

        return state

    def fail(
        self,
        execution_id: UUID,
        error: ExecutionError,
    ) -> ExecutionState:
        state = self._get_required(execution_id)

        self._transition(
            state,
            ExecutionStatus.FAILED,
        )

        state.completed_at = datetime.now()
        state.error = error

        return state

    def _get_required(self, execution_id: UUID) -> ExecutionState:
        state = self.get(execution_id)

        if state is None:
            raise ValueError(
                f"Execution state not found: {execution_id}"
            )

        return state

    def _transition(
        self,
        state: ExecutionState,
        new_status: str,
    ) -> None:
        allowed_statuses = self._ALLOWED_TRANSITIONS.get(
            state.status,
            set(),
        )

        if new_status not in allowed_statuses:
            raise ValueError(
                f"Invalid execution status transition: "
                f"{state.status} -> {new_status}"
            )

        state.status = new_status


execution_manager = ExecutionManager()