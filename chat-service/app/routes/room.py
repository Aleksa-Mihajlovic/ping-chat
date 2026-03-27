import uuid
from fastapi import APIRouter, Depends, Header, HTTPException
from app.schemas.room import RoomCreate, RoomResponse, AddMemberRequest, RoomMemberResponse
from app.schemas.common import BaseResponse
from app.services.room_service import RoomService
from typing import List

router = APIRouter()


@router.post("/rooms", response_model=RoomResponse, status_code=201)
async def create_room(
    data: RoomCreate,
    x_user_id: str = Header(),
    service: RoomService = Depends(RoomService),
):
    return await service.create_room(uuid.UUID(x_user_id), data)

@router.get("/rooms", response_model=List[RoomResponse])
async def get_user_rooms(x_user_id: str = Header(), service: RoomService = Depends(RoomService)):
    return await service.get_my_rooms(uuid.UUID(x_user_id))

@router.get("/rooms/{room_id}", response_model=RoomResponse)
async def get_room(room_id: uuid.UUID, x_user_id: str = Header(), service: RoomService = Depends(RoomService)):
    return await service.get_room(room_id, uuid.UUID(x_user_id))

@router.post("/rooms/member", response_model=BaseResponse, status_code=201)
async def add_member(
    data: AddMemberRequest,
    x_user_id: str = Header(),
    service: RoomService = Depends(RoomService)
):
    result = await service.add_member_to_room(uuid.UUID(x_user_id), data)
    return BaseResponse(success=True, data=RoomMemberResponse.model_validate(result), message="Member added successfully")

@router.delete("/rooms/{room_id}/members/{member_id}", response_model=BaseResponse, status_code=200)
async def remove_member(
        member_id: uuid.UUID,
        room_id: uuid.UUID,
        service: RoomService = Depends(RoomService)
):
    await service.remove_member_from_room(room_id, member_id)
    return BaseResponse(success=True, message="Member removed successfully")