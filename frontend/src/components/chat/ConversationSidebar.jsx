import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, MessageSquarePlus, Settings, LogOut } from 'lucide-react'
import Avatar from '../ui/Avatar'
import IconButton from '../ui/IconButton'
import SearchBar from './SearchBar'
import ChatListItem from './ChatListItem'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

export default function ConversationSidebar({ chats, selectedId, onSelect }) {
  const [search, setSearch] = useState('')
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

  return (
    <aside className="sidebar">
      <header className="sidebar__header">
        <Avatar name={user ? `${user.first_name} ${user.last_name}` : '?'} size={38} />
        <div className="sidebar__actions">
          <IconButton icon={<Users size={20} />}             label="Novi grupni chat" />
          <IconButton icon={<MessageSquarePlus size={20} />} label="Novi chat" />
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
        {filtered.map(chat => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            active={chat.id === selectedId}
            onClick={() => onSelect(chat.id)}
          />
        ))}
      </div>
    </aside>
  )
}
