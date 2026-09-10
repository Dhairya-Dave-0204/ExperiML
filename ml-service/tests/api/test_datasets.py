from uuid import uuid4

import pandas as pd
from fastapi.testclient import TestClient

from app.api.dependencies import internal_service_auth
from app.core.config import settings
from app.main import app
from app.storage.local import LocalStorageProvider


app.dependency_overrides[internal_service_auth] = lambda: None

client = TestClient(app)


def test_analyze_dataset_success(tmp_path, monkeypatch):
    storage_root = tmp_path / "storage"
    storage_provider = LocalStorageProvider(storage_root)

    dataset_id = uuid4()
    storage_key = f"projects/{uuid4()}/datasets/{dataset_id}/data.csv"

    dataframe = pd.DataFrame(
        {
            "age": [21, 25, 21, None],
            "city": ["Ahmedabad", "Surat", "Ahmedabad", "Mumbai"],
            "salary": [30000, 40000, 30000, 50000],
        }
    )

    csv_path = tmp_path / "dataset.csv"
    dataframe.to_csv(csv_path, index=False)

    with csv_path.open("rb") as source:
        storage_provider.save(storage_key, source)

    monkeypatch.setattr(
        settings,
        "storage_root",
        str(storage_root),
    )

    response = client.post(
        "/datasets/analyze",
        json={
            "dataset_id": str(dataset_id),
            "version": 1,
            "format": "CSV",
            "storage_key": storage_key,
            "file_size": csv_path.stat().st_size,
            "mime_type": "text/csv",
            "checksum": "test-checksum",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["row_count"] == 4
    assert data["column_count"] == 3
    assert data["format"] == "CSV"

    assert data["duplicate_row_count"] == 1
    assert data["duplicate_row_percentage"] == 25.0

    assert len(data["columns"]) == 3

    age_column = next(
        column
        for column in data["columns"]
        if column["name"] == "age"
    )

    assert age_column["missing_count"] == 1
    assert age_column["missing_percentage"] == 25.0
    assert age_column["non_null_count"] == 3
    assert age_column["unique_count"] == 2


def test_analyze_dataset_not_found(tmp_path, monkeypatch):
    storage_root = tmp_path / "storage"

    monkeypatch.setattr(
        settings,
        "storage_root",
        str(storage_root),
    )

    dataset_id = uuid4()

    response = client.post(
        "/datasets/analyze",
        json={
            "dataset_id": str(dataset_id),
            "version": 1,
            "format": "CSV",
            "storage_key": (
                f"projects/{uuid4()}/datasets/"
                f"{dataset_id}/data.csv"
            ),
            "file_size": 100,
            "mime_type": "text/csv",
            "checksum": "test-checksum",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"].startswith(
        "Dataset file not found:"
    )


def test_analyze_dataset_invalid_request():
    response = client.post(
        "/datasets/analyze",
        json={
            "dataset_id": str(uuid4()),
            "version": 1,
            "format": "INVALID",
            "storage_key": "some/file.csv",
            "file_size": 100,
            "mime_type": "text/csv",
            "checksum": "test-checksum",
        },
    )

    assert response.status_code == 422