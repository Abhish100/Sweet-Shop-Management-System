import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function SignInModal({ open, onClose, onLoginSuccess }: { open: boolean, onClose: () => void, onLoginSuccess?: () => void }) {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(username, password)
      setUsername(''); setPassword('')
      onLoginSuccess?.()
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white rounded shadow p-6 w-full max-w-sm z-10">
        <h3 className="text-lg font-semibold mb-3">Sign in to continue</h3>
        <form onSubmit={handleSubmit} aria-label="signin-form">
          <div className="mb-3">
            <label className="block text-sm">Username</label>
            <input aria-label="signin-username" value={username} onChange={e => setUsername(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-3">
            <label className="block text-sm">Password</label>
            <input aria-label="signin-password" value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full border rounded px-3 py-2" />
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <button type="button" className="text-sm text-gray-600" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
