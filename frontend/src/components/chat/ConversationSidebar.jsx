import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, MessageSquarePlus, Settings, LogOut } from 'lucide-react'
import Avatar from '../ui/Avatar'
import IconButton from '../ui/IconButton'
import SearchBar from './SearchBar'
import ChatListItem from './ChatListItem'
import CreateRoomModal from './CreateRoomModal'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

export default function ConversationSidebar({ chats, loading, selectedId, onSelect, onRoomCreated }) {
  const [search, setSearch]           = useState('')
  const [createType, setCreateType]   = useState(null) // 'direct' | 'group' | null
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleLogout = async () => {
    await api.post('/auth/logout')
    setUser(null)
    navigate('/login')
  }

  const handleRoomCreated = (room) => {
    onRoomCreated(room)
    setCreateType(null)
  }

  return (
    <aside className="sidebar">
      <header className="sidebar__header">
        <Avatar name={user ? `${user.first_name} ${user.last_name}` : '?'} size={38} />
        <div className="sidebar__actions">
          <IconButton icon={<Users size={20} />}             label="Novi grupni chat"  onClick={() => setCreateType('group')} />
          <IconButton icon={<MessageSquarePlus size={20} />} label="Novi direktni chat" onClick={() => setCreateType('direct')} />
          <IconButton icon={<Settings size={20} />}          label="Podešavanja" />
          <IconButton icon={<LogOut size={20} />}            label="Odjavi se" onClick={handleLogout} />
        </div>
      </header>

      <div className="sidebar__search">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Pretraži ili počni novi chat"
        />
      </div>

      <div className="sidebar__list">
        {loading ? (
          <p className="sidebar__empty">Učitavanje...</p>
        ) : filtered.map(chat => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            active={chat.id === selectedId}
            onClick={() => onSelect(chat.id)}
          />
        ))}
      </div>

      {createType && (
        <CreateRoomModal
          initialType={createType}
          onClose={() => setCreateType(null)}
          onCreated={handleRoomCreated}
        />
      )}
    </aside>
  )
}
