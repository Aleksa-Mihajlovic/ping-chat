import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { chatService } from '../../services/chat.service'

export default function CreateRoomModal({ initialType = 'group', onClose, onCreated }) {
  const [type, setType]       = useState(initialType)
  const [name, setName]       = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (type === 'group' && !name.trim()) {
      setError('Naziv grupe je obavezan')
      return
    }
    setLoading(true)
    setError('')
    try {
      const room = await chatService.createRoom({ type, name: name.trim() || null })
      onCreated(room)
      onClose()
    } catch {
      setError('Greška pri kreiranju sobe. Pokušaj ponovo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Novi chat" onClose={onClose}>
      <div className="modal__tabs">
        <button
          type="button"
          className={`modal__tab${type === 'direct' ? ' modal__tab--active' : ''}`}
          onClick={() => { setType('direct'); setError('') }}
        >
          Direktno
        </button>
        <button
          type="button"
          className={`modal__tab${type === 'group' ? ' modal__tab--active' : ''}`}
          onClick={() => { setType('group'); setError('') }}
        >
          Grupno
        </button>
      </div>

      <form className="modal__form" onSubmit={handleSubmit}>
        <Input
          label="Naziv"
          placeholder={type === 'group' ? 'Naziv grupe (obavezno)' : 'Naziv (opciono)'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          autoFocus
        />
        <div className="modal__footer">
          <Button variant="ghost" type="button" onClick={onClose}>Otkaži</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Kreiranje...' : 'Kreiraj'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
