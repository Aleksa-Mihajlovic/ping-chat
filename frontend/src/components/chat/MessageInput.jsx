import { useState } from 'react'
import { Smile, Paperclip, Mic, Send } from 'lucide-react'
import IconButton from '../ui/IconButton'

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  return (
    <div className="msg-input">
      <IconButton icon={<Smile size={22} />}     label="Emoji" />
      <IconButton icon={<Paperclip size={22} />} label="Prikači fajl" />
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="Napiši poruku"
        rows={1}
      />
      <IconButton
        icon={text.trim() ? <Send size={22} /> : <Mic size={22} />}
        label={text.trim() ? 'Pošalji' : 'Glasovna poruka'}
        onClick={handleSend}
      />
    </div>
  )
}
