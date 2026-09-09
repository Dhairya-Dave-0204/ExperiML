from pathlib import Path

from app.core.config import settings


def test_storage_root_is_loaded():
    assert settings.storage_root == "storage"


def test_storage_root_is_relative_path():
    assert not Path(
        settings.storage_root
    ).is_absolute()