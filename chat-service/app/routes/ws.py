import uuid
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from jose import jwt, JWTError

from app.config import settings
from app.websocket.connection_manager import manager
from app.services.message_service import MessageService
from app.services.room_service import RoomService

router = APIRouter()


def _decode_token(token: str) -> uuid.UUID:
    payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    return uuid.UUID(payload["sub"])


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_id: uuid.UUID,
    message_service: MessageService = Depends(MessageService),
    room_service: RoomService = Depends(RoomService),
):
    token = websocket.cookies.get("access_token")
    if not token:
        await websocket.close(code=1008)
        return

    try:
        user_id = _decode_token(token)
    except (JWTError, Exception):
        await websocket.close(code=1008)  # 1008 = Policy Violation (bad auth)
        return

    if not await room_service.is_member(room_id, user_id):
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, room_id, user_id)

    try:
        while True:
            data = await websocket.receive_json()
            content = data.get("content", "").strip()
            if not content:
                continue

            message = await message_service.save_message(room_id, user_id, content)

            await manager.broadcast(room_id, {
                "id":         str(message.id),
                "room_id":    str(message.room_id),
                "sender_id":  str(message.sender_id),
                "content":    message.content,
                "created_at": message.created_at.isoformat(),
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
