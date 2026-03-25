# Ping Chat

A microservices-based real-time chat application.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, nginx |
| Gateway | FastAPI, httpx |
| Auth Service | FastAPI, PostgreSQL, Alembic, Redis |
| Chat Service | FastAPI, PostgreSQL, Redis, WebSocket |
| Infrastructure | Docker, PostgreSQL 16, Redis 7 |

## Architecture

```
Browser
  └── Frontend (nginx :80)
        └── API calls → Gateway (:8000)
                          ├── /auth/* → Auth Service (:8001)
                          └── /chat/* → Chat Service (:8002)
                                            ├── PostgreSQL
                                            └── Redis
```

**Gateway** handles JWT authentication, rate limiting (100 req/60s per IP), and request proxying. Auth tokens are stored as HTTP-only cookies — the gateway sets and clears them, backend services never touch cookies directly.

## Quick Start

**Prerequisites:** Docker and Docker Compose

```bash
git clone https://github.com/your-username/ping-chat.git
cd ping-chat
cp .env.example .env
```

Edit `.env` and set your values:

```env
POSTGRES_PASSWORD=your_password
JWT_SECRET=your_secret_key_at_least_32_characters
```

Then start everything:

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| App | http://localhost |
| Gateway API | http://localhost:8000/docs |
| Auth Service | http://localhost:8001/docs |
| Chat Service | http://localhost:8002/docs |

## Environment Variables

| Variable | Description |
|---|---|
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `JWT_SECRET` | Secret key for signing JWT tokens |

All other variables (service URLs, Redis URL) are wired automatically inside docker-compose.

## Local Development (without Docker)

**Prerequisites:** Python 3.12+, Node 20+, PostgreSQL, Redis

### Gateway
```bash
cd gateway
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Auth Service
```bash
cd auth-service
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8001
```

### Chat Service
```bash
cd chat-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8002
```

### Frontend
```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

Each service reads its config from its own `.env` file. Copy `.env.example` from the root as a reference.

## Project Structure

```
ping-chat/
├── gateway/          # API gateway — auth middleware, rate limiter, proxy
├── auth-service/     # Registration, login, logout, JWT issuance
├── chat-service/     # Chat rooms, messages, WebSocket
├── frontend/         # React SPA
├── scripts/
│   └── init-db.sql   # Creates auth_db and chat_db on first run
└── docker-compose.yml
```
