from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.config import settings
# from app.db.database import init_db


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     print("Auth Service starting...")
#     await init_db()
#     yield
#     print("Auth Service shutting down...")


app = FastAPI(
    title="Ping Chat — Auth Service",
    version="0.1.0",
    # lifespan=lifespan
)


@app.get("/auth/health")
async def health():
    return {"status": "ok", "service": "auth-service"}