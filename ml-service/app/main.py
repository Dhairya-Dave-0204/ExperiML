from fastapi import FastAPI

from app.core.logging import configure_logging

from app.api.routes.health import router as health_router
from app.api.routes.executions import router as executions_router


configure_logging()

app = FastAPI(
    title="ExperiML ML Service",
    version="1.0.0",
)

app.include_router(health_router)
app.include_router(executions_router)

# TODO: Modify the column detection such a way that the id columns, date and target columns