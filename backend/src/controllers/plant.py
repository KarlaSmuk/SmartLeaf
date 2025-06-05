from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from db.models import Plant
from schemas.plant import PlantCreate, PlantOut
from db.db import get_db

router = APIRouter(prefix="/api/plants", tags=["plants"])

@router.post("", response_model=PlantOut)
def create_plant(plant: PlantCreate, db: Session = Depends(get_db)):
    db_plant = Plant(**plant.model_dump())
    db.add(db_plant)
    db.commit()
    db.refresh(db_plant)
    return db_plant

@router.get("", response_model=List[PlantOut])
def get_plants(db: Session = Depends(get_db)):
    return db.query(Plant).all()
