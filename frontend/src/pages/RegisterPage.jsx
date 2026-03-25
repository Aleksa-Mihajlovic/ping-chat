import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const navigate = useNavigate()

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/chat')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">Ping Chat</h1>
        <p className="auth-sub">Kreiraj novi nalog</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Ime i prezime"
            type="text"
            placeholder="Ime Prezime"
            value={form.name}
            onChange={set('name')}
            icon={<User size={16} />}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="vas@email.com"
            value={form.email}
            onChange={set('email')}
            icon={<Mail size={16} />}
            required
          />
          <Input
            label="Lozinka"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={set('password')}
            icon={<Lock size={16} />}
            required
          />
          <Input
            label="Potvrdi lozinku"
            type="password"
            placeholder="••••••••"
            value={form.confirm}
            onChange={set('confirm')}
            icon={<Lock size={16} />}
            required
          />
          <Button type="submit" fullWidth>Registruj se</Button>
        </form>
        <p className="auth-footer">
          Već imaš nalog? <Link to="/login">Prijavi se</Link>
        </p>
      </div>
    </div>
  )
}
