import { useId, useState } from 'react'

import { addCourseForUser } from '../../shared/api/courses'
import { useAuth } from '../../shared/auth/AuthContext'
import { cn } from '../../shared/lib/cn'
import { useModal } from '../../shared/ui/ModalContext'
import { Button } from '../Button'

type Mode = 'login' | 'register'

export function AuthModal() {
  const formId = useId()
  const { isAuthModalOpen, closeAuthModal, pendingCourseId } = useModal()
  const { clearError, lastError, login, register, status } = useAuth()

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

  const handleSubmit = async (e: React.SyntheticEvent) => {
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
      const newToken =
        mode === 'login'
          ? await login(trimmedEmail, trimmedPassword)
          : await register(trimmedEmail, trimmedPassword)

      if (pendingCourseId && newToken) {
        try {
          await addCourseForUser(pendingCourseId, newToken)
        } catch {
          setLocalError('Курс не был добавлен. Попробуйте ещё раз.')
          return
        }
      }

      closeAuthModal()
    } catch {
      setLocalError(lastError ?? 'Не удалось выполнить вход')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[30px] border border-[#D9D9D9] bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
        <div className="border-b border-[#D9D9D9] p-5 sm:p-6">
          <h2
            id="auth-modal-title"
            className="pr-10 text-xl font-medium text-[#202020]"
          >
            {mode === 'login' ? 'Вход' : 'Регистрация'}
          </h2>
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute right-4 top-4 text-[#202020]/50 hover:text-[#202020]"
            aria-label="Закрыть"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            void handleSubmit(e)
          }}
          className="space-y-4 p-5 sm:p-6"
        >
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f7f7f7] p-1">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={cn(
                'rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                mode === 'login'
                  ? 'bg-white text-[#202020] shadow-sm'
                  : 'text-[#202020]/70 hover:text-[#202020]',
              )}
            >
              Войти
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('register')}
              className={cn(
                'rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                mode === 'register'
                  ? 'bg-white text-[#202020] shadow-sm'
                  : 'text-[#202020]/70 hover:text-[#202020]',
              )}
            >
              Регистрация
            </button>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#202020]"
              htmlFor={`${formId}-email`}
            >
              Email
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              placeholder="user@example.com"
              className="h-11 w-full rounded-xl border border-[#D9D9D9] bg-white px-3 text-sm text-[#202020] outline-none focus:border-[#BCEC30] focus:ring-1 focus:ring-[#BCEC30]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#202020]"
              htmlFor={`${formId}-password`}
            >
              Пароль
            </label>
            <input
              id={`${formId}-password`}
              type="password"
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-[#D9D9D9] bg-white px-3 text-sm text-[#202020] outline-none focus:border-[#BCEC30] focus:ring-1 focus:ring-[#BCEC30]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {mode === 'register' && (
            <div className="rounded-2xl border border-[#D9D9D9] bg-[#f7f7f7] p-4 text-xs text-[#202020]/80">
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
