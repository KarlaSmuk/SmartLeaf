from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.db import get_db
from schemas.user import UserResponse
from services.user import UserService
from utils.auth import get_current_user

router = APIRouter(prefix="/api/user", tags=["user"])

@router.get("/", response_model=UserResponse)
def get_user(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user_service = UserService(db)
    user = user_service.get_user(current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=user.id,
        fullName=user.full_name,
        email=user.email,
    )