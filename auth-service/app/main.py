from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db.database import init_db
from app.routes.auth import router as auth_router
from app.exceptions.exception_handlers import register_exception_handlers


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Auth Service starting...")
    await init_db()
    yield
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