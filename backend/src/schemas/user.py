from datetime import datetime, date
from uuid import UUID

from pydantic import BaseModel

class UserBase(BaseModel):
    email: str
    fullName: str


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    password: str = None


class UserResponse(UserBase):
    id: UUID

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
