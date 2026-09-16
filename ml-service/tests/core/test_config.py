from app.core.config import settings


def test_storage_root_is_loaded():
    assert settings.storage_root == "../backend/storage"


def test_storage_root_is_relative_path():
    assert not settings.storage_root.startswith("/")


def test_uploads_root_is_loaded():
    assert settings.uploads_root == "../backend/uploads"