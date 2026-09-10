from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import internal_service_auth
from app.core.config import settings
from app.ml.datasets.analyzer import DatasetAnalyzer
from app.ml.datasets.loader import DatasetLoader
from app.schemas.dataset import (
    DatasetAnalysis,
    DatasetAnalysisRequest,
)
from app.schemas.experiment import DatasetReference
from app.storage.local import LocalStorageProvider


router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"],
    dependencies=[
        Depends(internal_service_auth)
    ],
)


def request_to_dataset_reference(
    request: DatasetAnalysisRequest,
) -> DatasetReference:
    return DatasetReference(
        id=request.dataset_id,
        version=request.version,
        format=request.format,
        storage_key=request.storage_key,
        file_size=request.file_size,
        mime_type=request.mime_type,
        checksum=request.checksum,
    )


@router.post(
    "/analyze",
    response_model=DatasetAnalysis,
)
async def analyze_dataset(
    request: DatasetAnalysisRequest,
) -> DatasetAnalysis:
    storage_provider = LocalStorageProvider(
        settings.storage_root
    )

    dataset_loader = DatasetLoader(
        storage_provider=storage_provider
    )

    analyzer = DatasetAnalyzer()

    try:
        dataframe = dataset_loader.load(
            dataset=request_to_dataset_reference(request)
        )
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return analyzer.analyze(
        dataframe=dataframe,
        dataset_format=request.format,
    )