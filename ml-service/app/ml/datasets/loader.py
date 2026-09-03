from io import BytesIO

import pandas as pd

from app.schemas.experiment import DatasetFormat, DatasetReference
from app.storage.base import StorageProvider


class DatasetLoader:
    def __init__(self, storage_provider: StorageProvider):
        self.storage_provider = storage_provider

    def load(self, dataset: DatasetReference) -> pd.DataFrame:
        if not self.storage_provider.exists(dataset.storage_key):
            raise FileNotFoundError(
                f"Dataset file not found: {dataset.storage_key}"
            )

        with self.storage_provider.open(dataset.storage_key) as source:
            data = source.read()

        return self._load_dataframe(
            data=data,
            dataset_format=dataset.format,
        )

    def _load_dataframe(
        self,
        data: bytes,
        dataset_format: DatasetFormat,
    ) -> pd.DataFrame:
        buffer = BytesIO(data)

        if dataset_format == DatasetFormat.CSV:
            return pd.read_csv(buffer)

        if dataset_format == DatasetFormat.XLSX:
            return pd.read_excel(buffer)

        if dataset_format == DatasetFormat.PARQUET:
            return pd.read_parquet(buffer)

        raise ValueError(
            f"Unsupported dataset format: {dataset_format}"
        )