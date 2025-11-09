# backend/database/schemas.py
from pydantic import BaseModel, Field
from datetime import datetime

class Prediction(BaseModel):
    filename: str
    label: str
    confidence: float
    duration: float | None = None   
    timestamp: datetime = Field(default_factory=datetime.utcnow)
