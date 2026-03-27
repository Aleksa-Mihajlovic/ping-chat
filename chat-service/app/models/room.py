import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
from app.enums import RoomType, MemberRole


class Room(Base):
    __tablename__ = "rooms"

    id:         Mapped[uuid.UUID]      = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name:       Mapped[str | None]     = mapped_column(String(100), nullable=True)
    type:       Mapped[RoomType]       = mapped_column(Enum(RoomType, name="room_type"), nullable=False)
    created_by: Mapped[uuid.UUID]      = mapped_column(UUID(as_uuid=True), nullable=False)
    created_at: Mapped[datetime]       = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    members:  Mapped[list["RoomMember"]] = relationship("RoomMember", back_populates="room", cascade="all, delete-orphan")
    messages: Mapped[list["Message"]]    = relationship("Message",    back_populates="room", cascade="all, delete-orphan")


class RoomMember(Base):
    __tablename__ = "room_members"

    room_id:    Mapped[uuid.UUID]        = mapped_column(UUID(as_uuid=True), ForeignKey("rooms.id", ondelete="CASCADE"), primary_key=True)
    user_id:    Mapped[uuid.UUID]        = mapped_column(UUID(as_uuid=True), primary_key=True)
    role:       Mapped[MemberRole]       = mapped_column(Enum(MemberRole, name="member_role"), nullable=False, default=MemberRole.member)
    invited_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    joined_at:  Mapped[datetime]         = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    room: Mapped["Room"] = relationship("Room", back_populates="members")
