# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ping Chat is a microservices-based real-time chat application with four components:
- **gateway** — API gateway handling CORS, JWT auth, rate limiting, and request proxying
- **auth-service** — User authentication (FastAPI + PostgreSQL + Alembic)
- **chat-service** — Chat rooms/messages + WebSocket support (FastAPI + PostgreSQL + Redis)
- **frontend** — React 19 + Vite SPA (JavaScript, not TypeScript; ESLint flat config v9+)

## Commands

### Frontend
```bash
cd frontend
npm install
npm run dev        # Dev server on localhost:5173
npm run build
npm run preview    # Preview production build locally
npm run lint
```

### Backend Services
Each service (gateway, auth-service, chat-service) follows the same pattern:
```bash
cd <service>
pip install -r requirements.txt
uvicorn app.main:app --reload --port <port>
# gateway: 8000, auth-service: 8001, chat-service: 8002
```

### Database Migrations (auth-service, chat-service)
```bash
alembic upgrade head
alembic revision --autogenerate -m "<description>"
```

> Migration scripts are stored in `migrations/versions/` (not the default `alembic/versions/`). The `alembic.ini` `script_location` is set to `./migrations`.

## Architecture

### Request Flow
```
Frontend (5173) → Gateway (8000) → auth-service (8001)
                                 → chat-service (8002)
```

### Gateway Middleware Stack
1. **Rate limiter** (`app/middleware/rate_limiter.py`) — sliding window via Redis sorted sets, 100 req/60s per IP
2. **Auth** (`app/middleware/auth.py`) — validates JWT from cookies, checks Redis token blacklist, injects `x-user-id` and `x-user-email` headers into proxied requests

Public routes that bypass auth: `/health`, `/auth/register`, `/auth/login`, `/auth/refresh`, `/docs`

### Service Structure
All three Python services share the same layout:
```
app/
  main.py       # FastAPI app + lifespan
  config.py     # Pydantic settings
  db/database.py  # Async SQLAlchemy session
  models/
  routes/
  schemas/
  services/
```

Services use a `BaseService` class for DB session injection via FastAPI `Depends`:
```python
class BaseService:
    def __init__(self, session: AsyncSession = Depends(get_db)):
        self.session = session
```

**User identity in backend services:** the gateway injects `x-user-id` and `x-user-email` as HTTP headers before proxying. Services read user identity from these headers — they never decode JWTs themselves.

**chat-service routing:** all routes are mounted under `/chat` (e.g. `POST /chat/rooms`, `GET /chat/health`).

### Infrastructure Dependencies
- **PostgreSQL** — persistent data (auth + chat)
- **Redis** — rate limiting state and JWT blacklist (revoked tokens)
- **JWT cookies** — auth tokens (not Authorization headers)

## Environment
Copy `.env.example` to `.env` before running services. Key variables: `POSTGRES_PASSWORD`, `JWT_SECRET`, `AUTH_SERVICE_URL`, `CHAT_SERVICE_URL`, `REDIS_URL`.
