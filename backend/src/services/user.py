# services/user_service.py
import uuid
from uuid import UUID

from sqlalchemy.orm import Session

from db.models import User
from schemas.user import UserCreate, UserUpdate
from utils.auth import get_password_hash


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user: UserCreate):
        # Check if email exists
        if self.db.query(User).filter(User.email == user.email).first():
            raise ValueError("User with this email already exists.")

        hashedPassword = get_password_hash(user.password)

        new_user = User(
            id=uuid.uuid4(),
            email=user.email,
            password_hash=hashedPassword,
            full_name=user.fullName
        )

        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user

    def get_user(self, user_id: UUID):
        user = self.db.query(User).filter(User.id == user_id).first()
        return user

    def get_users(self):
        users = self.db.query(User).all()
        return users

    def update_user(self, user_id: UUID, user_update: UserUpdate):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        # Update user fields
        user.email = user_update.email or user.email
        user.password_hash = user_update.password_hash or user.password_hash
        user.password_hash = user_update.full_name or user.password_hash

        self.db.commit()
        self.db.refresh(user)
        return user

    def delete_user(self, user_id: UUID):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        self.db.delete(user)
        self.db.commit()
        return user