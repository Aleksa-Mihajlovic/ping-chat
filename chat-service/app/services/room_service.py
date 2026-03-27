import uuid
from fastapi import HTTPException
from typing import List

from sqlalchemy import select,delete
from sqlalchemy.orm import selectinload
from app.services.base_service import BaseService
from app.schemas.room import RoomCreate, AddMemberRequest, RoomMemberResponse
from app.models.room import Room, RoomMember
from app.enums import MemberRole


class RoomService(BaseService):

    async def create_room(self, created_by: uuid.UUID, data: RoomCreate) -> Room:
        room = Room(
            name=data.name,
            type=data.type,
            created_by=created_by,
        )

        self.session.add(room)
        await self.session.flush()

        self.session.add(RoomMember(
            room_id=room.id,
            user_id=created_by,
            role=MemberRole.owner,
            invited_by=None,
        ))

        await self.session.commit()

        result = await self.session.execute(
            select(Room)
            .options(selectinload(Room.members))
            .where(Room.id == room.id)
        )
        return result.scalar_one()


    async def get_my_rooms(self, user_id: uuid.UUID) -> List[Room]:
        result = await self.session.execute(
            select(Room)
            .join(Room.members)
            .where(RoomMember.user_id == user_id)
            .options(selectinload(Room.members))
        )
        return list(result.scalars().all())

    async def get_room(self, room_id: uuid.UUID, user_id: uuid.UUID) -> Room:
        result = await self.session.execute(
            select(Room)
            .where(Room.id == room_id)
            .options(selectinload(Room.members))
        )
        room = result.scalar_one_or_none()

        if not room:
            raise HTTPException(status_code=404, detail="Room not found")

        is_member = any(m.user_id == user_id for m in room.members)
        if not is_member:
            raise HTTPException(status_code=403, detail="You are not a member of this room")

        return room

    async def add_member_to_room(self, added_by_id: uuid.UUID, data: AddMemberRequest):
        member = RoomMember(room_id=data.room_id, user_id=data.user_id, invited_by=added_by_id, role=data.role)
        self.session.add(member)
        await self.session.commit()
        await self.session.refresh(member)
        return member

    async def is_member(self, room_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        result = await self.session.execute(
            select(RoomMember).where(
                RoomMember.room_id == room_id,
                RoomMember.user_id == user_id,
            )
        )
        return result.scalar_one_or_none() is not None

    async def remove_member_from_room(self, room_id: uuid.UUID, member_id: uuid.UUID):
        result = await self.session.execute(
            delete(RoomMember).where(RoomMember.room_id == room_id, RoomMember.user_id == member_id)
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Member not found in room")
        await self.session.commit()



