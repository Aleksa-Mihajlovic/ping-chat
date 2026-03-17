from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from pydantic_core import PydanticCustomError
from datetime import datetime
from uuid import UUID
import re


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    username: str
    password: str

    @field_validator("first_name", "last_name")
    @classmethod
    def name_length(cls, v):
        if len(v) < 2:
            raise PydanticCustomError("invalid_length", "Must be at least 2 characters")
        if len(v) > 50:
            raise PydanticCustomError("invalid_length", "Must be at most 50 characters")
        return v

    @field_validator("username")
    @classmethod
    def username_format(cls, v):
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise PydanticCustomError(
                "invalid_format",
                "Username can only contain letters, numbers and underscores")
        return v

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        checks = [
            (len(v) >= 8, "Password must be at least 8 characters"),
            (len(v) <= 100, "Password must be at most 100 characters"),
            (re.search(r"[A-Z]", v), "Password must contain at least one uppercase letter"),
            (re.search(r"[0-9]", v), "Password must contain at least one number"),
            (re.search(r"[!@#$%^&*(),.?\":{}|<>]", v), "Password must contain at least one special character"),
        ]

        for result, message in checks:
            if not result:
                raise PydanticCustomError("invalid_format", message)

        return v

class UserLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    first_name: str
    last_name: str
    email: str
    username: str
    is_active: bool
    created_at: datetime



