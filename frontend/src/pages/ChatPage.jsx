import { useState, useEffect, useRef } from 'react'
import { MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRooms } from '../hooks/useRooms'
import { useMessages } from '../hooks/useMessages'
import { useWebSocket } from '../hooks/useWebSocket'
import ConversationSidebar from '../components/chat/ConversationSidebar'
import ChatHeader from '../components/chat/ChatHeader'
import Message from '../components/chat/Message'
import MessageInput from '../components/chat/MessageInput'

export default function ChatPage() {
  const { user } = useAuth()
  const [selectedId, setSelectedId] = useState(null)
  const bottomRef = useRef(null)

  const { rooms, loading: roomsLoading, addRoom } = useRooms()
  const { messages, addMessage }                  = useMessages(selectedId, user?.id)
  const { sendMessage }                           = useWebSocket(selectedId, addMessage)

  const selectedRoom = rooms.find(r => r.id === selectedId)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, selectedId])

  const handleSend = (text) => {
    sendMessage(text)
  }

  return (
    <div className="chat-page">
      <ConversationSidebar
        chats={rooms}
        loading={roomsLoading}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onRoomCreated={addRoom}
      />
      <main className="chat-area">
        {selectedRoom ? (
          <>
            <ChatHeader chat={selectedRoom} />
            <div className="chat-messages">
              {messages.map(msg => (
                <Message
                  key={msg.id}
                  msg={msg}
                  isGroup={selectedRoom.type === 'group'}
                />
              ))}
              <div ref={bottomRef} />
            </div>
            <MessageInput onSend={handleSend} />
          </>
        ) : (
          <div className="chat-empty">
            <MessageCircle size={64} strokeWidth={1} />
            <h2>Ping Chat</h2>
            <p>Odaberi razgovor da počneš chat</p>
          </div>
        )}
      </main>
    </div>
  )
}
