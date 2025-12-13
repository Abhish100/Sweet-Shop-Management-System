import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as loginService, register as registerService, getProfile } from '../services/auth'
import { TokenStorage } from '../utils/tokenStorage'

import type { User as ApiUser } from '../services/auth'

type AuthContextType = {
  user: ApiUser | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => TokenStorage.get())
  const [user, setUser] = useState<ApiUser | null>(null)

  useEffect(() => {
    if (token) {
      getProfile().then(u => setUser(u)).catch(() => {
        setToken(null);
        TokenStorage.remove();
      })
    }
  }, [token])

  const login = async (username: string, password: string) => {
    const { token } = await loginService(username, password)
    setToken(token)
    TokenStorage.set(token)
    const prof = await getProfile()
    setUser(prof)
  }

  const register = async (username: string, password: string) => {
    await registerService(username, password)
    await login(username, password)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    TokenStorage.remove()
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
