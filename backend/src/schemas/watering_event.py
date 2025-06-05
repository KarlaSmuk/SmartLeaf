from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class WateringEventCreate(BaseModel):
    plant_id: UUID
    triggered_by: str

class WateringEventOut(WateringEventCreate):
    id: UUID
    timestamp: datetime

    class Config:
        orm_mode = True