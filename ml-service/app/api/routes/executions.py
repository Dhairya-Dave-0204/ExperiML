from uuid import UUID

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    status,
)

from app.api.dependencies import (
    get_execution_orchestrator,
    internal_service_auth,
)
from app.execution.manager import execution_manager
from app.execution.orchestrator import ExecutionOrchestrator
from app.schemas.execution import (
    ExecutionAcceptedResponse,
    ExecutionRequest,
    ExecutionResponse,
)

router = APIRouter(
    prefix="/executions",
    tags=["Executions"],
    dependencies=[
        Depends(internal_service_auth)
    ],
)


@router.post(
    "",
    response_model=ExecutionAcceptedResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def create_execution(
    request: ExecutionRequest,
    background_tasks: BackgroundTasks,
    orchestrator: ExecutionOrchestrator = Depends(
        get_execution_orchestrator
    ),
) -> ExecutionAcceptedResponse:

    state = execution_manager.create(
        request.execution_id
    )

    background_tasks.add_task(
        _run_execution,
        request,
        orchestrator,
    )

    return ExecutionAcceptedResponse(
        execution_id=state.execution_id,
        status=state.status,
    )


async def _run_execution(
    request: ExecutionRequest,
    orchestrator: ExecutionOrchestrator,
) -> None:

    if request.execution_type == "EXPERIMENT":
        orchestrator.execute_experiment(
            request
        )

        return

    raise ValueError(
        f"Unsupported execution type: "
        f"{request.execution_type}"
    )


@router.get(
    "/{execution_id}",
    response_model=ExecutionResponse,
)
async def get_execution(
    execution_id: UUID,
) -> ExecutionResponse:

    state = execution_manager.get(
        execution_id
    )

    if state is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Execution not found",
        )
    return state