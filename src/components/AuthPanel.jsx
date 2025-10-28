import { useEffect, useState } from 'react'
import { User, LogIn, LogOut } from 'lucide-react'

export default function AuthPanel({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const token = localStorage.getItem('tutor_token')
    const storedName = localStorage.getItem('tutor_name')
    const storedEmail = localStorage.getItem('tutor_email')
    if (token && storedEmail) {
      setProfile({ name: storedName || 'Learner', email: storedEmail })
    }
  }, [])

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login'
      const body = mode === 'register' ? { name, email, password } : { email, password }
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.detail || 'Authentication failed')
      }
      const data = await res.json()
      localStorage.setItem('tutor_token', data.access_token)
      if (data.name) localStorage.setItem('tutor_name', data.name)
      if (data.email) localStorage.setItem('tutor_email', data.email)
      setProfile({ name: data.name || name || 'Learner', email: data.email || email })
      onAuth?.({ token: data.access_token, name: data.name || name, email: data.email || email })
      setPassword('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('tutor_token')
    setProfile(null)
  }

  if (profile) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-indigo-600" />
          <div>
            <div className="text-sm font-medium text-gray-800">{profile.name}</div>
            <div className="text-xs text-gray-500">{profile.email}</div>
          </div>
        </div>
        <button onClick={logout} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-700">
          <LogIn className="w-5 h-5" />
          <h2 className="font-semibold">{mode === 'register' ? 'Create account' : 'Login'}</h2>
        </div>
        <button
          onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          {mode === 'register' ? 'Have an account? Login' : "New here? Register"}
        </button>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        {mode === 'register' && (
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            className="border rounded-md px-3 py-2 text-sm"
          />
        )}
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="border rounded-md px-3 py-2 text-sm"
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="border rounded-md px-3 py-2 text-sm"
        />
        <button
          onClick={submit}
          disabled={loading}
          className="md:col-span-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg"
        >
          {loading ? 'Please wait…' : (mode === 'register' ? 'Create account' : 'Login')}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  )
}
