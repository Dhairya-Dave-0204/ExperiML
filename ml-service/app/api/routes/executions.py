from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import internal_service_auth
from app.execution.manager import execution_manager
from app.schemas.execution import (
    ExecutionAcceptedResponse,
    ExecutionRequest,
    ExecutionResponse,
)

router = APIRouter(
    prefix="/executions",
    tags=["Executions"],
    dependencies=[Depends(internal_service_auth)],
)


@router.post(
    "",
    response_model=ExecutionAcceptedResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def create_execution(
    request: ExecutionRequest,
) -> ExecutionAcceptedResponse:
    state = execution_manager.create(request.execution_id)

    return ExecutionAcceptedResponse(
        execution_id=state.execution_id,
        status=state.status,
    )


@router.get(
    "/{execution_id}",
    response_model=ExecutionResponse,
)
async def get_execution(
    execution_id: UUID,
) -> ExecutionResponse:
    state = execution_manager.get(execution_id)

    if state is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Execution not found",
        )

    return state