import { useState, useEffect, useCallback } from 'react'
import { chatService, normalizeMessage } from '../services/chat.service'

export function useMessages(roomId, currentUserId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (!roomId) { setMessages([]); return }

    setLoading(true)
    chatService.getMessages(roomId)
      .then(data => setMessages(data.map(m => normalizeMessage(m, currentUserId))))
      .catch(err => console.error('Failed to fetch messages:', err))
      .finally(() => setLoading(false))
  }, [roomId, currentUserId])

  const addMessage = useCallback((msg) => {
    setMessages(prev => [...prev, normalizeMessage(msg, currentUserId)])
  }, [currentUserId])

  return { messages, loading, addMessage }
}
