from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from db.models import Notification
from schemas.notification import NotificationCreate, NotificationOut
from db.db import get_db

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

@router.post("", response_model=NotificationOut)
def create_notification(notification: NotificationCreate, db: Session = Depends(get_db)):
    db_notification = Notification(**notification.model_dump())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

@router.get("", response_model=List[NotificationOut])
def get_notifications(db: Session = Depends(get_db)):
    return db.query(Notification).all()