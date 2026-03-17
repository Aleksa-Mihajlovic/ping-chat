from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin, TokenResponse
from app.services.user_service import register_user, login_user

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=201)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await register_user(db, user)

@router.post("/login", response_model=TokenResponse, status_code=200)
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    token = await login_user(db, user)
    return TokenResponse(access_token=token)