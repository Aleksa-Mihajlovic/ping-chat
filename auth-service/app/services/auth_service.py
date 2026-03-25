from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.core.security import hash_password, verify_password
from app.exceptions.auth_exceptions import AlreadyExistsError, InvalidCredentialsError, EntityNotFoundError
from app.core.jwt import create_access_token
from app.config import settings
from jose import jwt as jose_jwt
import asyncio


async def register_user(db: AsyncSession, data: UserCreate) -> User:
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise AlreadyExistsError("Email already registered")

    result = await db.execute(select(User).where(User.username == data.username))
    if result.scalar_one_or_none():
        raise AlreadyExistsError("Username already taken")

    user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        username=data.username,
        hashed_password=await asyncio.to_thread(hash_password, data.password),
    )

    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user

async def login_user(db: AsyncSession, data: UserLogin) -> str:
    result = await db.execute(select(User).where(User.username == data.username))
    user = result.scalar_one_or_none()
    if not user:
        raise InvalidCredentialsError("Invalid credentials")

    if not await asyncio.to_thread(verify_password, data.password, user.hashed_password):
        raise InvalidCredentialsError("Invalid credentials")

    return create_access_token({"sub": str(user.id), "email": user.email})


async def me(user_id: int, db: AsyncSession) -> User:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise EntityNotFoundError("User not found")

    return user

async def logout_user(token: str, redis) -> None:
    payload = jose_jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    jti = payload.get("jti")
    exp = payload.get("exp")
    if jti and exp:
        import time
        ttl = int(exp - time.time())
        if ttl > 0:
            await redis.setex(f"blacklist:{jti}", ttl, "1")

