import uuid
from fastapi import APIRouter, Depends, Header, HTTPException
from app.schemas.message import MessageResponse
from app.services.message_service import MessageService
from app.services.room_service import RoomService

router = APIRouter()


@router.get("/rooms/{room_id}/messages", response_model=list[MessageResponse])
async def get_messages(
    room_id: uuid.UUID,
    offset: int = 0,
    limit: int = 50,
    x_user_id: str = Header(),
    message_service: MessageService = Depends(MessageService),
    room_service: RoomService = Depends(RoomService),
):
    if not await room_service.is_member(room_id, uuid.UUID(x_user_id)):
        raise HTTPException(status_code=403, detail="You are not a member of this room")

    return await message_service.get_room_messages(room_id, limit=limit, offset=offset)
