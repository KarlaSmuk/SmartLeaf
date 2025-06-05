from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from db.models import Base

class Plant(Base):
    __tablename__ = "plants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    species = Column(String)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    moisture_threshold = Column(Float)
    automation_watering_enabled = Column(Boolean, default=True)

    user = relationship("User", back_populates="plants")
    sensor_readings = relationship("SensorReading", back_populates="plant")
    notifications = relationship("Notification", back_populates="plant")
    watering_events = relationship("WateringEvent", back_populates="plant")
