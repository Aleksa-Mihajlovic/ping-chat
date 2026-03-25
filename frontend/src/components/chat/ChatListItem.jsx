import Avatar from '../ui/Avatar'

export default function ChatListItem({ chat, active, onClick }) {
  return (
    <div className={`chat-item${active ? ' chat-item--active' : ''}`} onClick={onClick}>
      <Avatar name={chat.name} size={46} online={chat.online} />
      <div className="chat-item__content">
        <div className="chat-item__row">
          <span className="chat-item__name">{chat.name}</span>
          <span className="chat-item__time">{chat.lastTime}</span>
        </div>
        <div className="chat-item__row">
          <span className="chat-item__last">{chat.lastMessage}</span>
          {chat.unread > 0 && <span className="badge">{chat.unread}</span>}
        </div>
      </div>
    </div>
  )
}
