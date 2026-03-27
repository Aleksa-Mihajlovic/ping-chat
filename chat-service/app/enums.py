from enum import Enum


class RoomType(str, Enum):
    direct = "direct"
    group  = "group"


class MemberRole(str, Enum):
    owner  = "owner"
    admin  = "admin"
    member = "member"
