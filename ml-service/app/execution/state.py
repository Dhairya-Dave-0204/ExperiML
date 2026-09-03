from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.schemas.errors import ExecutionError
from app.schemas.execution import (
    ExecutionResult,
    ExecutionStatus,
)


class ExecutionState(BaseModel):
    execution_id: UUID
    status: str = ExecutionStatus.QUEUED
    stage: str | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None
    result: ExecutionResult | None = None
    error: ExecutionError | None = None


class ExecutionStateStore:
    def __init__(self):
        self._states: dict[UUID, ExecutionState] = {}

    def create(self, execution_id: UUID) -> ExecutionState:
        state = ExecutionState(
            execution_id=execution_id,
        )

        self._states[execution_id] = state

        return state

    def get(self, execution_id: UUID) -> ExecutionState | None:
        return self._states.get(execution_id)

    def delete(self, execution_id: UUID) -> None:
        self._states.pop(execution_id, None)


execution_state_store = ExecutionStateStore()