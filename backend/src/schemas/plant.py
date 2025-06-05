from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class PlantCreate(BaseModel):
    name: str
    species: Optional[str] = None
    user_id: UUID
    moisture_threshold: float
    automation_watering_enabled: bool = True

class PlantOut(PlantCreate):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True
