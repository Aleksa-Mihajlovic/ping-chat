# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Early-stage service. The `models/`, `routes/`, `schemas/`, and `services/` directories exist but are empty. Alembic has not been initialized yet (`alembic.ini` and `migrations/` are absent). The lifespan hook in `main.py` is commented out pending DB setup.

## Configuration

`app/config.py` uses `pydantic-settings`. Required `.env` variables:
- `DATABASE_URL` — must use `postgresql+asyncpg://` scheme (async driver)
- `JWT_SECRET` — used with HS256
- `ACCESS_TOKEN_EXPIRE_MINUTES` (default: 60)
- `REFRESH_TOKEN_EXPIRE_DAYS` (default: 30)

## Key Patterns

**DB session injection** — `get_db()` in `app/db/database.py` is the FastAPI dependency. It auto-commits on success and rolls back on exception. Import `Base` from there for all ORM models.

**Password hashing** — use `passlib[bcrypt]` (already installed).

**JWT** — use `python-jose[cryptography]` (already installed). Tokens are expected to be delivered via cookies, not `Authorization` headers (enforced at the gateway level).

**Routes** — prefix all routes with `/auth/` to match gateway proxy rules.

## Initializing Alembic

When models are ready:
```bash
alembic init -t async migrations
# Set sqlalchemy.url in alembic.ini to use the asyncpg DATABASE_URL
# In migrations/env.py: import Base from app.db.database and set target_metadata = Base.metadata
alembic revision --autogenerate -m "initial"
alembic upgrade head
```
