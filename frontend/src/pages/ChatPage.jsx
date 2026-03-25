import { useState, useEffect, useRef } from 'react'
import { MessageCircle } from 'lucide-react'
import ConversationSidebar from '../components/chat/ConversationSidebar'
import ChatHeader from '../components/chat/ChatHeader'
import Message from '../components/chat/Message'
import MessageInput from '../components/chat/MessageInput'
import { CHATS, MESSAGES } from '../data/mockData'

export default function ChatPage() {
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState(MESSAGES)
  const bottomRef = useRef(null)

  const selectedChat = CHATS.find(c => c.id === selectedId)
  const chatMessages = selectedId ? (messages[selectedId] ?? []) : []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages.length, selectedId])

  const sendMessage = (text) => {
    const newMsg = {
      id: Date.now(),
      from: 'me',
      text,
      time: new Date().toLocaleTimeString('sr', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    }
    setMessages(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), newMsg],
    }))
  }

  return (
    <div className="chat-page">
      <ConversationSidebar
        chats={CHATS}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <main className="chat-area">
        {selectedChat ? (
          <>
            <ChatHeader chat={selectedChat} />
            <div className="chat-messages">
              {chatMessages.map(msg => (
                <Message
                  key={msg.id}
                  msg={msg}
                  isGroup={selectedChat.type === 'group'}
                />
              ))}
              <div ref={bottomRef} />
            </div>
            <MessageInput onSend={sendMessage} />
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
