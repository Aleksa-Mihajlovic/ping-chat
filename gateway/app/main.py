from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
import redis.asyncio as aioredis
import httpx
from app.middleware.rate_limiter import RateLimiterMiddleware
from app.middleware.auth import AuthMiddleware
from app.routes.proxy import router as proxy_router

# Globalna Redis konekcija — kreira se jednom pri startu
redis_client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──────────────────────────
    global redis_client
    print("Gateway starting...")

    # Konektujemo se na Redis
    redis_client = aioredis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True  # vraća string umjesto bytes
    )

    # Testiramo konekciju
    try:
        await redis_client.ping()
        print("Redis connected")
    except Exception:
        print("Redis not available — rate limiting disabled")

    app.state.redis = redis_client

    http_client = httpx.AsyncClient(timeout=30.0)
    app.state.http_client = http_client

    yield

    # ── Shutdown ─────────────────────────
    print("Gateway shutting down...")
    await http_client.aclose()
    if redis_client:
        await redis_client.aclose()







app = FastAPI(
    title="Ping Chat — Gateway",
    version="0.1.0",
    lifespan=lifespan
)



app.add_middleware(AuthMiddleware)

app.add_middleware(
    RateLimiterMiddleware,
    max_requests=100,
    window_seconds=60
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


app.include_router(proxy_router)