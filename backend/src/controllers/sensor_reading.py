from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from db.models import SensorReading
from schemas.sensor_reading import SensorReadingCreate, SensorReadingOut
from db.db import get_db

router = APIRouter(prefix="/api/sensor-readings", tags=["sensor_readings"])

@router.post("", response_model=SensorReadingOut)
def create_sensor_reading(reading: SensorReadingCreate, db: Session = Depends(get_db)):
    db_reading = SensorReading(**reading.model_dump())
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading

@router.get("", response_model=List[SensorReadingOut])
def get_sensor_readings(db: Session = Depends(get_db)):
    return db.query(SensorReading).all()