import uuid
from sqlalchemy import select
from app.services.base_service import BaseService
from app.models.message import Message


class MessageService(BaseService):

    async def save_message(self, room_id: uuid.UUID, sender_id: uuid.UUID, content: str) -> Message:
        message = Message(room_id=room_id, sender_id=sender_id, content=content)
        self.session.add(message)
        await self.session.commit()
        await self.session.refresh(message)
        return message

    async def get_room_messages(self, room_id: uuid.UUID, limit: int = 50, offset: int = 0) -> list[Message]:
        result = await self.session.execute(
            select(Message)
            .where(Message.room_id == room_id)
            .order_by(Message.created_at.asc())
            .offset(offset)
            .limit(limit)
        )
        return list(result.scalars().all())
