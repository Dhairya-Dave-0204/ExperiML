from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.core.logging import configure_logging


configure_logging()

app = FastAPI(
    title="ExperiML ML Service",
    version="1.0.0",
)

app.include_router(health_router)