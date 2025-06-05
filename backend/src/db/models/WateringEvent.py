from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from db.models import Base

class WateringEvent(Base):
    __tablename__ = "watering_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plant_id = Column(UUID(as_uuid=True), ForeignKey("plants.id"))
    triggered_by = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    plant = relationship("Plant", back_populates="watering_events")
