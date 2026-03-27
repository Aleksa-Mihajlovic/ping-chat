import uuid
from datetime import datetime, timezone
from sqlalchemy import Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base


class Message(Base):
    __tablename__ = "messages"

    id:        Mapped[uuid.UUID]      = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_id:   Mapped[uuid.UUID]      = mapped_column(UUID(as_uuid=True), ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    sender_id: Mapped[uuid.UUID]      = mapped_column(UUID(as_uuid=True), nullable=False)
    content:   Mapped[str]            = mapped_column(Text, nullable=False)
    edited_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime]      = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    room:  Mapped["Room"]              = relationship("Room",        back_populates="messages")
    reads: Mapped[list["MessageRead"]] = relationship("MessageRead", back_populates="message", cascade="all, delete-orphan")


class MessageRead(Base):
    __tablename__ = "message_reads"

    message_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("messages.id", ondelete="CASCADE"), primary_key=True)
    user_id:    Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    read_at:    Mapped[datetime]  = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    message: Mapped["Message"] = relationship("Message", back_populates="reads")
