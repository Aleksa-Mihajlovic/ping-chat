from fastapi import FastAPI
from app.routes.room import router as room_router
from app.routes.message import router as message_router
from app.routes.ws import router as ws_router

app = FastAPI(
    title="Ping Chat — Chat Service",
    version="0.1.0",
)

app.include_router(room_router, prefix="/chat")
app.include_router(message_router, prefix="/chat")
app.include_router(ws_router, prefix="/chat")


@app.get("/chat/health")
async def health():
    return {"status": "ok", "service": "chat-service"}