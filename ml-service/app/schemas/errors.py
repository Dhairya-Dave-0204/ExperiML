from pydantic import BaseModel


class ExecutionError(BaseModel):
    code: str
    message: str
    stage: str | None = None
    details: dict | None = None