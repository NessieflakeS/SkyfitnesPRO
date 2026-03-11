import { useId, useState } from 'react'
import { Button } from '../Button'
import { useAuth } from '../../shared/auth/AuthContext'
import { useModal } from '../../shared/ui/ModalContext'
import { addCourseForUser } from '../../shared/api/courses'
import { cn } from '../../shared/lib/cn'

type Mode = 'login' | 'register'

export function AuthModal() {
  const formId = useId()
  const { isAuthModalOpen, closeAuthModal, pendingCourseId } = useModal()
  const { login, register, lastError, clearError, status, token } = useAuth()

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const isLoading = status === 'loading'

  if (!isAuthModalOpen) return null

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode)
    clearError()
    setLocalError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

      if (pendingCourseId && token) {
        try {
          await addCourseForUser(pendingCourseId, token)
        } catch (error) {
          console.error('Failed to add course after auth:', error)
          setLocalError('Курс не был добавлен. Попробуйте ещё раз.')
          return
        }
      }

      closeAuthModal()
    } catch {
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'login' ? 'Вход' : 'Регистрация'}
          </h2>
          <button
            onClick={closeAuthModal}
            className="absolute right-4 top-4 text-2xl text-slate-400 hover:text-slate-600"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={cn(
                'rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
                mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600',
              )}
            >
              Войти
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('register')}
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
            {isLoading ? 'Секунду...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </form>
      </div>
    </div>
  )
}