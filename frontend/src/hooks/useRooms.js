import { useState, useEffect, useCallback } from 'react'
import { chatService, normalizeRoom } from '../services/chat.service'

export function useRooms() {
  const [rooms, setRooms]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    chatService.getRooms()
      .then(setRooms)
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [])

  const addRoom = useCallback((room) => {
    setRooms(prev => [normalizeRoom(room), ...prev])
  }, [])

  return { rooms, loading, error, addRoom }
}
