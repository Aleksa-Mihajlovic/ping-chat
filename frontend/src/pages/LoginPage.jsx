import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
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
        <p className="auth-sub">Dobrodošli nazad</p>
        <form onSubmit={handleSubmit} className="auth-form">
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
          <Button type="submit" fullWidth>Prijavi se</Button>
        </form>
        <p className="auth-footer">
          Nemaš nalog? <Link to="/register">Registruj se</Link>
        </p>
      </div>
    </div>
  )
}
