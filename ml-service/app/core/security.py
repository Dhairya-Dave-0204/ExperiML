import secrets

from fastapi import Header, HTTPException, status

from app.core.config import settings


async def verify_internal_service_key(
    internal_service_key: str | None = Header(
        default=None,
        alias="X-Internal-Service-Key",
    ),
) -> None:
    """
    Verify that the request originates from a trusted internal service.

    The FastAPI service does not authenticate end users.
    Node/Express is responsible for user authentication and authorization.

    This dependency only validates the shared internal service key.
    """

    if not internal_service_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Internal service authentication required",
        )

    if not secrets.compare_digest(
        internal_service_key,
        settings.internal_service_key,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid internal service credentials",
        )