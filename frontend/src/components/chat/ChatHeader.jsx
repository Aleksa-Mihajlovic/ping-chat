import { Phone, Video, Search, MoreVertical } from 'lucide-react'
import Avatar from '../ui/Avatar'
import IconButton from '../ui/IconButton'

export default function ChatHeader({ chat }) {
  const subtitle =
    chat.type === 'group'
      ? `${chat.members?.length ?? 0} članova`
      : chat.online
        ? 'Online'
        : 'Offline'

  return (
    <header className="chat-header">
      <div className="chat-header__info">
        <Avatar name={chat.name} size={38} online={chat.online} />
        <div>
          <div className="chat-header__name">{chat.name}</div>
          <div className="chat-header__status">{subtitle}</div>
        </div>
      </div>
      <div className="chat-header__actions">
        <IconButton icon={<Phone size={20} />}        label="Poziv" />
        <IconButton icon={<Video size={20} />}        label="Video poziv" />
        <IconButton icon={<Search size={20} />}       label="Pretraži poruke" />
        <IconButton icon={<MoreVertical size={20} />} label="Više opcija" />
      </div>
    </header>
  )
}
