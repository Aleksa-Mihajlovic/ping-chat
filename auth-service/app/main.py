from fastapi import FastAPI
from contextlib import asynccontextmanager
import redis.asyncio as aioredis
from app.db.database import init_db
from app.routes.auth import router as auth_router
from app.exceptions.exception_handlers import register_exception_handlers
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Auth Service starting...")
    await init_db()
    redis_client = aioredis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
    app.state.redis = redis_client
    yield
    await redis_client.aclose()
    print("Auth Service shutting down...")

app = FastAPI(
    title="Ping Chat — Auth Service",
    version="0.1.0",
    lifespan=lifespan
)

register_exception_handlers(app)


@app.get("/auth/health")
async def health():
    return {"status": "ok", "service": "auth-service"}

app.include_router(auth_router, prefix="/auth")