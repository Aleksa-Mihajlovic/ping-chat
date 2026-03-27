from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from app.enums import RoomType, MemberRole


class RoomMemberBase(BaseModel):
    user_id: UUID
    role:    MemberRole


class RoomMemberResponse(RoomMemberBase):
    model_config = ConfigDict(from_attributes=True)

    invited_by: UUID | None
    joined_at:  datetime


class RoomBase(BaseModel):
    name: str | None = None
    type: RoomType


class RoomCreate(RoomBase):
    pass


class RoomResponse(RoomBase):
    model_config = ConfigDict(from_attributes=True)

    id:         UUID
    created_by: UUID
    created_at: datetime
    members:    list[RoomMemberResponse]


class AddMemberRequest(BaseModel):
    user_id: UUID
    room_id: UUID
    role: MemberRole
