from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration loaded from environment variables.
    """

    app_name: str = "ExperiML"
    app_env: str = "development"

    host: str = "127.0.0.1"
    port: int = 8000

    internal_service_key: str

    storage_root: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """
    Return the cached application settings instance.

    Caching ensures the environment configuration is loaded once
    and the same Settings instance is reused throughout the application.
    """
    return Settings()


settings = get_settings()