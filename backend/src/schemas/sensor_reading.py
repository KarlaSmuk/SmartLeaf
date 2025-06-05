from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class SensorReadingCreate(BaseModel):
    plant_id: UUID
    type: str
    value: float

class SensorReadingOut(SensorReadingCreate):
    id: UUID
    timestamp: datetime

    class Config:
        orm_mode = True