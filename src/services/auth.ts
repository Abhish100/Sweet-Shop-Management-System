import api from './api'

export type User = {
  id: string
  username: string
  role: 'admin' | 'user'
}

export async function login(username: string, password: string): Promise<{ token: string } & Partial<User>> {
  const res = await api.post('/auth/login', { username, password })
  return res.data
}

export async function register(username: string, password: string): Promise<{ success: boolean } | User> {
  const res = await api.post('/auth/register', { username, password })
  return res.data
}

export async function getProfile(): Promise<User> {
  const res = await api.get('/auth/profile')
  return res.data
}
