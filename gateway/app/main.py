from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Gateway starting...")
    yield
    print("Gateway shutting down...")


app = FastAPI(
    title="Ping Chat — Gateway",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "gateway"}

@app.get("/dummy")
async def dummy():
    return [
        {"FirstName" : "Aleksa", "LastName": "Mihajlovic"},
        {"FirstName" : "Aleksa", "LastName": "Mihajlovic"},
        {"FirstName" : "Aleksa", "LastName": "Mihajlovic"}
    ]