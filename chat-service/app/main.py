from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.config import settings
from app.db.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Chat Service starting...")
    await init_db()
    yield
    print("Chat Service shutting down...")


app = FastAPI(
    title="Ping Chat — Chat Service",
    version="0.1.0",
    lifespan=lifespan
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "chat-service"}