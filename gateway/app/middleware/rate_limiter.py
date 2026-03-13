from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import time


class RateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app,
        max_requests: int = 100,   # maksimalno requestova
        window_seconds: int = 60,  # u ovom vremenskom prozoru
    ):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds

    async def dispatch(self, request: Request, call_next):
        # Health check ne limitiramo — nema smisla
        if request.url.path == "/health":
            return await call_next(request)

        redis = request.app.state.redis

        # Ako Redis nije dostupan — puštamo request da prođe
        # Bolje da app radi bez rate limitinga nego da padne
        if redis is None:
            return await call_next(request)

        # ── Identifikacija korisnika ──────────────────────────
        # Uzimamo IP adresu kao identifikator
        # Ako je korisnik iza proxy-a, X-Forwarded-For header
        # sadrži pravu IP adresu
        client_ip = request.headers.get(
            "X-Forwarded-For",
            request.client.host
        )

        # Redis key izgleda ovako: "ratelimit:192.168.1.1"
        key = f"ratelimit:{client_ip}"

        # ── Sliding Window algoritam ──────────────────────────
        # Koristimo Redis pipeline — šalje više komandi odjednom
        # umjesto jednu po jednu (brže, atomično)
        try:
            async with redis.pipeline(transaction=True) as pipe:
                now = time.time()
                window_start = now - self.window_seconds

                pipe.zremrangebyscore(key, 0, window_start)  # 1. briši stare
                pipe.zadd(key, {str(now): now})              # 2. dodaj novi request
                pipe.zcard(key)                              # 3. broji ukupno
                pipe.expire(key, self.window_seconds)        # 4. postavi TTL

                results = await pipe.execute()
                request_count = results[2]  # rezultat zcard komande

        except Exception:
            # Ako Redis pukne usred requesta — pusti dalje
            return await call_next(request)

        # ── Provjera limita ───────────────────────────────────
        if request_count > self.max_requests:
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "Too many requests",
                    "limit": self.max_requests,
                    "window_seconds": self.window_seconds,
                    "retry_after": self.window_seconds,
                }
            )

        # Dodajemo headers u response da korisnik vidi
        # koliko mu je requestova ostalo (kao GitHub API)
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self.max_requests)
        response.headers["X-RateLimit-Remaining"] = str(
            max(0, self.max_requests - request_count)
        )
        response.headers["X-RateLimit-Window"] = str(self.window_seconds)

        return response