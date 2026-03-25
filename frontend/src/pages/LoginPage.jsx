import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Lock } from 'lucide-react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await api.post('/auth/login', form)
      const { data } = await api.get('/auth/me')
      setUser(data)
      navigate('/chat')
    } catch {
      setError('Pogrešan username ili lozinka')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">Ping Chat</h1>
        <p className="auth-sub">Dobrodošli nazad</p>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Username"
            type="text"
            placeholder="vas_username"
            value={form.username}
            onChange={set('username')}
            icon={<User size={16} />}
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
