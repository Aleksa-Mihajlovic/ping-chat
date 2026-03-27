import api from '../lib/api'

// Prilagođava room iz API-ja na shape koji UI očekuje
export const normalizeRoom = (room) => ({
  ...room,
  name:        room.name ?? 'Direct Message',
  lastMessage: null,
  lastTime:    null,
  unread:      0,
  online:      false,
})

// Prilagođava message iz API-ja/WS-a na shape koji Message komponenta očekuje
export const normalizeMessage = (msg, currentUserId) => ({
  id:     msg.id,
  from:   msg.sender_id === currentUserId ? 'me' : msg.sender_id,
  text:   msg.content,
  time:   new Date(msg.created_at).toLocaleTimeString('sr', { hour: '2-digit', minute: '2-digit' }),
  status: 'sent',
})

export const chatService = {
  getRooms: async () => {
    const { data } = await api.get('/chat/rooms')
    return data.map(normalizeRoom)
  },

  getMessages: async (roomId, params = {}) => {
    const { data } = await api.get(`/chat/rooms/${roomId}/messages`, { params })
    return data
  },

  createRoom: async (payload) => {
    const { data } = await api.post('/chat/rooms', payload)
    return normalizeRoom(data)
  },
}
