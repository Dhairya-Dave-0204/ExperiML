from uuid import uuid4

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.dependencies import (
    get_execution_orchestrator,
    internal_service_auth,
)
from app.api.routes.executions import router
from app.execution.manager import execution_manager
from app.schemas.execution import ExecutionStatus


class FakeExecutionOrchestrator:
    def __init__(self):
        self.called = False
        self.request = None

    def execute_experiment(self, request):
        self.called = True
        self.request = request


def create_test_app(
    orchestrator: FakeExecutionOrchestrator,
):
    app = FastAPI()

    app.include_router(router)

    app.dependency_overrides[
        get_execution_orchestrator
    ] = lambda: orchestrator

    app.dependency_overrides[
        internal_service_auth
    ] = lambda: None

    return app


def create_request():
    execution_id = uuid4()

    return {
        "execution_id": str(execution_id),
        "execution_type": "EXPERIMENT",
        "project_id": str(uuid4()),
        "experiment_id": str(uuid4()),
        "dataset": {
            "id": str(uuid4()),
            "version": 1,
            "format": "CSV",
            "storage_key": "datasets/test.csv",
            "file_size": 100,
            "mime_type": "text/csv",
            "checksum": "test-checksum",
        },
        "problem_type": "CLASSIFICATION",
        "algorithm": {
            "name": "logistic_regression",
            "configuration": {},
            "hyperparameters": {
                "max_iter": 1000,
            },
        },
        "configuration": {
            "target_column": "target",
            "identifier_columns": [],
            "datetime_columns": [],
        },
    }


def test_create_execution_returns_202():
    orchestrator = FakeExecutionOrchestrator()

    app = create_test_app(orchestrator)

    client = TestClient(app)

    payload = create_request()

    response = client.post(
        "/executions",
        json=payload,
    )

    assert response.status_code == 202

    body = response.json()

    assert (
        body["execution_id"]
        == payload["execution_id"]
    )

    assert (
        body["status"]
        == ExecutionStatus.QUEUED
    )

    assert orchestrator.called is True

    assert (
        str(orchestrator.request.execution_id)
    == payload["execution_id"]
    )


def test_get_execution_returns_current_state():
    execution_id = uuid4()

    execution_manager.create(
        execution_id
    )

    orchestrator = FakeExecutionOrchestrator()

    app = create_test_app(orchestrator)

    client = TestClient(app)

    response = client.get(
        f"/executions/{execution_id}"
    )

    assert response.status_code == 200

    body = response.json()

    assert (
        body["execution_id"]
        == str(execution_id)
    )

    assert (
        body["status"]
        == ExecutionStatus.QUEUED
    )