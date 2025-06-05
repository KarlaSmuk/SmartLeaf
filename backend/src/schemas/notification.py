from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class NotificationCreate(BaseModel):
    user_id: UUID
    plant_id: UUID
    message: str
    persistent: bool = True

class NotificationOut(NotificationCreate):
    id: UUID
    created_at: datetime
    read: bool = False

    class Config:
        orm_mode = True