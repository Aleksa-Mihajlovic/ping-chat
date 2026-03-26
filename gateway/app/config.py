from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    AUTH_SERVICE_URL: str
    CHAT_SERVICE_URL: str
    REDIS_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost"]

    class Config:
        env_file = ".env"


settings = Settings()