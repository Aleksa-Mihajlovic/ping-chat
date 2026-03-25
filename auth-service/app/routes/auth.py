from fastapi import APIRouter, Depends, Header, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin, TokenResponse
from app.services.auth_service import register_user, login_user, me, logout_user

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=201)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await register_user(db, user)

@router.post("/login", response_model=TokenResponse, status_code=200)
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    token = await login_user(db, user)
    return TokenResponse(access_token=token)

@router.get("/me", response_model=UserResponse, status_code=200)
async def get_me(
        db: AsyncSession = Depends(get_db),
        x_user_id: str | None = Header(default=None)
):
    result = await me(x_user_id, db)
    return result

@router.post("/logout", status_code=200)
async def logout(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    await logout_user(token, request.app.state.redis)
    return {"message": "Logged out"}
