import { useId, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/Button'
import { useAuth } from '../../shared/auth/AuthContext'
import { cn } from '../../shared/lib/cn'

type Mode = 'login' | 'register'

export function AuthPage() {
  const formId = useId()
  const navigate = useNavigate()
  const { login, register, lastError, clearError, status } = useAuth()

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const title = useMemo(() => {
    if (mode === 'login') return 'Вход'
    return 'Регистрация'
  }, [mode])

  const isLoading = status === 'loading'

  const handleSubmit = async (event: unknown) => {
    if (
      !event ||
      typeof event !== 'object' ||
      !('preventDefault' in event) ||
      typeof (event as { preventDefault?: unknown }).preventDefault !== 'function'
    ) {
      return
    }

    ;(event as { preventDefault: () => void }).preventDefault()
    setLocalError(null)
    clearError()

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      setLocalError('Введите email и пароль')
      return
    }

    if (mode === 'register') {
      if (trimmedPassword.length < 6) {
        setLocalError('Пароль должен содержать не менее 6 символов')
        return
      }
      const specials = trimmedPassword.match(/[^a-zA-Z0-9а-яА-Я]/g)?.length ?? 0
      if (specials < 2) {
        setLocalError('Пароль должен содержать не менее 2 спецсимволов')
        return
      }
      if (!/[A-ZА-Я]/.test(trimmedPassword)) {
        setLocalError('Пароль должен содержать как минимум одну заглавную букву')
        return
      }
    }

    try {
      if (mode === 'login') {
        await login(trimmedEmail, trimmedPassword)
      } else {
        await register(trimmedEmail, trimmedPassword)
      }

      void navigate('/', { replace: true })
    } catch {
      // lastError задаётся в контексте
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">
            Используется реальное API. Требования к паролю: минимум 6 символов, минимум 2
            спецсимвола и минимум 1 заглавная буква.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                clearError()
                setLocalError(null)
              }}
              className={cn(
                'rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
                mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600',
              )}
            >
              Войти
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                clearError()
                setLocalError(null)
              }}
              className={cn(
                'rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600',
              )}
            >
              Регистрация
            </button>
          </div>
        </div>

        <form
          className="space-y-4 p-6"
          aria-labelledby={formId}
          onSubmit={(event) => {
            void handleSubmit(event)
          }}
        >
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor={`${formId}-email`}
            >
              Email
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              placeholder="user@example.com"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor={`${formId}-password`}
            >
              Пароль
            </label>
            <input
              id={`${formId}-password`}
              type="password"
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {mode === 'register' && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              Пароль: не менее 6 символов, не менее двух спецсимволов и не менее одной
              заглавной буквы.
            </div>
          )}

          {(localError ?? lastError) && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {localError ?? lastError}
            </div>
          )}

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>

          <div className="text-center text-xs text-slate-500">
            Нажимая кнопку, вы соглашаетесь с условиями сервиса.
          </div>
        </form>
      </div>
    </div>
  )
}
