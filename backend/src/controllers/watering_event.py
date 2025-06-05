from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from db.models import WateringEvent
from schemas.watering_event import WateringEventCreate, WateringEventOut
from db.db import get_db

router = APIRouter(prefix="/api/watering-events", tags=["watering_events"])

@router.post("", response_model=WateringEventOut)
def create_watering_event(event: WateringEventCreate, db: Session = Depends(get_db)):
    db_event = WateringEvent(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("", response_model=List[WateringEventOut])
def get_watering_events(db: Session = Depends(get_db)):
    return db.query(WateringEvent).all()