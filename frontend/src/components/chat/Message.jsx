import { Check, CheckCheck } from 'lucide-react'

function StatusIcon({ status }) {
  if (status === 'read')      return <CheckCheck size={14} style={{ color: '#53bdeb' }} />
  if (status === 'delivered') return <CheckCheck size={14} />
  return <Check size={14} />
}

export default function Message({ msg, isGroup }) {
  const isMe = msg.from === 'me'

  return (
    <div className={`msg ${isMe ? 'msg--out' : 'msg--in'}`}>
      {isGroup && !isMe && msg.senderName && (
        <span className="msg__sender">{msg.senderName}</span>
      )}
      <p className="msg__text">{msg.text}</p>
      <div className="msg__meta">
        <span className="msg__time">{msg.time}</span>
        {isMe && <StatusIcon status={msg.status} />}
      </div>
    </div>
  )
}
