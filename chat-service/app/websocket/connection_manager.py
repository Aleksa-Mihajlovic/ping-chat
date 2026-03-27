import uuid
from collections import defaultdict
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        # room_id -> list of (websocket, user_id)
        self.rooms: dict[uuid.UUID, list[tuple[WebSocket, uuid.UUID]]] = defaultdict(list)

    async def connect(self, websocket: WebSocket, room_id: uuid.UUID, user_id: uuid.UUID):
        await websocket.accept()
        self.rooms[room_id].append((websocket, user_id))

    def disconnect(self, websocket: WebSocket, room_id: uuid.UUID):
        self.rooms[room_id] = [
            (ws, uid) for ws, uid in self.rooms[room_id] if ws != websocket
        ]
        if not self.rooms[room_id]:
            del self.rooms[room_id]

    async def broadcast(self, room_id: uuid.UUID, message: dict):
        for ws, _ in self.rooms.get(room_id, []):
            await ws.send_json(message)


manager = ConnectionManager()
