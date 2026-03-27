import { useEffect, useRef } from 'react'
import { WS_BASE_URL } from '../config'

export function useWebSocket(roomId, onMessage) {
  const wsRef        = useRef(null)
  const onMessageRef = useRef(onMessage)

  // Uvek drži referencu na najnoviji callback, bez ponovnog konekcije
  useEffect(() => { onMessageRef.current = onMessage })

  useEffect(() => {
    if (!roomId) return

    const ws = new WebSocket(`${WS_BASE_URL}/chat/ws/${roomId}`)
    wsRef.current = ws

    ws.onmessage = (e) => onMessageRef.current(JSON.parse(e.data))
    ws.onerror   = (e) => console.error('WebSocket error:', e)

    return () => ws.close()
  }, [roomId])

  const sendMessage = (content) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content }))
    }
  }

  return { sendMessage }
}
