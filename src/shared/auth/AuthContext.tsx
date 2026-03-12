import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { getCurrentUser, login as apiLogin, register as apiRegister } from '../api/auth'

import { readStoredAuth, writeStoredAuth } from './storage'

import type { ApiError } from '../api/client'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

type AuthUser = {
  email: string
  selectedCourses: string[]
}

type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<string | null>
  register: (email: string, password: string) => Promise<string | null>
  logout: () => void
  refreshUser: () => Promise<void>
  lastError: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

type Props = {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const [status, setStatus] = useState<AuthStatus>('idle')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)

  useEffect(() => {
    const stored = readStoredAuth()
    if (!stored) {
      setStatus('unauthenticated')
      return
    }

    setStatus('loading')
    setToken(stored.token)

    void getCurrentUser(stored.token)
      .then((current) => {
        setUser(current)
        setStatus('authenticated')
      })
      .catch(() => {
        writeStoredAuth(null)
        setUser(null)
        setToken(null)
        setStatus('unauthenticated')
      })
  }, [])

  const handleError = useCallback((error: unknown) => {
    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as ApiError).message
      setLastError(message || 'Не удалось выполнить запрос')
    } else {
      setLastError('Не удалось выполнить запрос')
    }
  }, [])

  const login = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      setLastError(null)
      setStatus('loading')
      try {
        const newToken = await apiLogin(email, password)
        writeStoredAuth({ token: newToken })
        setToken(newToken)
        const current = await getCurrentUser(newToken)
        setUser(current)
        setStatus('authenticated')
        return newToken
      } catch (error) {
        handleError(error)
        setUser(null)
        setToken(null)
        writeStoredAuth(null)
        setStatus('unauthenticated')
        throw error
      }
    },
    [handleError],
  )

  const register = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      setLastError(null)
      setStatus('loading')
      try {
        await apiRegister(email, password)
        const newToken = await apiLogin(email, password)
        writeStoredAuth({ token: newToken })
        setToken(newToken)
        const current = await getCurrentUser(newToken)
        setUser(current)
        setStatus('authenticated')
        return newToken
      } catch (error) {
        handleError(error)
        setStatus('unauthenticated')
        throw error
      }
    },
    [handleError],
  )

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    writeStoredAuth(null)
    setStatus('unauthenticated')
  }, [])

  const clearError = useCallback(() => {
    setLastError(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const t = readStoredAuth()?.token
    if (!t) return
    try {
      const current = await getCurrentUser(t)
      setUser(current)
    } catch {
      setUser(null)
      setToken(null)
      writeStoredAuth(null)
      setStatus('unauthenticated')
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      token,
      login,
      register,
      logout,
      refreshUser,
      lastError,
      clearError,
    }),
    [status, user, token, login, register, logout, refreshUser, lastError, clearError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth должен вызываться внутри AuthProvider')
  }
  return ctx
}
