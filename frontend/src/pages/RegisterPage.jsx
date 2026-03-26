import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Lock } from 'lucide-react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import api from '../lib/api'

const schema = z.object({
  first_name: z.string().min(2, 'Must be at least 2 characters').max(50, 'Must be at most 50 characters'),
  last_name:  z.string().min(2, 'Must be at least 2 characters').max(50, 'Must be at most 50 characters'),
  username:   z.string().regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores'),
  email:      z.string().email('Invalid email address'),
  password:   z.string()
    .min(8, 'Must be at least 8 characters')
    .max(100, 'Must be at most 100 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character'),
  confirm: z.string(),
}).refine(data => data.password === data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})

export default function RegisterPage() {
  const [serverError, setServerError] = useState(null)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })

  const onSubmit = async (data) => {
    setServerError(null)
    try {
      await api.post('/auth/register', {
        first_name: data.first_name,
        last_name:  data.last_name,
        username:   data.username,
        email:      data.email,
        password:   data.password,
      })
      navigate('/login')
    } catch (err) {
      setServerError(err.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <h1 className="auth-logo">Ping Chat</h1>
        <p className="auth-sub">Create an account</p>
        {serverError && <p className="auth-error">{serverError}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="auth-form__grid">
            <Input label="First Name" type="text"     placeholder="John"            icon={<User size={16} />} error={errors.first_name?.message} {...register('first_name')} />
            <Input label="Last Name"  type="text"     placeholder="Doe"             icon={<User size={16} />} error={errors.last_name?.message}  {...register('last_name')}  />
            <Input label="Username"   type="text"     placeholder="john_doe"        icon={<User size={16} />} error={errors.username?.message}   {...register('username')}   className="col-span-2" />
            <Input label="Email"      type="email"    placeholder="you@example.com" icon={<Mail size={16} />} error={errors.email?.message}      {...register('email')}      className="col-span-2" />
            <Input label="Password"         type="password" placeholder="••••••••" icon={<Lock size={16} />} error={errors.password?.message}   {...register('password')}   />
            <Input label="Confirm Password" type="password" placeholder="••••••••" icon={<Lock size={16} />} error={errors.confirm?.message}    {...register('confirm')}    />
          </div>
          <Button type="submit" fullWidth>Register</Button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
