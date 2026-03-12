import { useId, useState } from 'react'

import { addCourseForUser } from '../../shared/api/courses'
import { useAuth } from '../../shared/auth/AuthContext'
import { cn } from '../../shared/lib/cn'
import { useModal } from '../../shared/ui/ModalContext'

type Mode = 'login' | 'register'

export function AuthModal() {
  const formId = useId()
  const { isAuthModalOpen, closeAuthModal, pendingCourseId } = useModal()
  const { clearError, lastError, login, register, status } = useAuth()

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const isLoading = status === 'loading'

  const hasEmail = email.trim().length > 0
  const hasPassword = password.length > 0
  const hasPasswordRepeat = passwordRepeat.length > 0
  const passwordsMatch = mode === 'login' || password === passwordRepeat

  const canSubmitLogin = hasEmail && hasPassword
  const canSubmitRegister =
    hasEmail &&
    hasPassword &&
    hasPasswordRepeat &&
    passwordsMatch &&
    password.length >= 6 &&
    (password.match(/[^a-zA-Z0-9а-яА-Я]/g)?.length ?? 0) >= 2 &&
    /[A-ZА-Я]/.test(password)

  const isDisabled = mode === 'login' ? !canSubmitLogin : !canSubmitRegister

  if (!isAuthModalOpen) return null

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode)
    clearError()
    setLocalError(null)
    if (newMode === 'login') setPasswordRepeat('')
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLocalError(null)
    clearError()

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (mode === 'login') {
      if (!trimmedEmail || !trimmedPassword) return
    } else {
      if (
        !trimmedEmail ||
        !trimmedPassword ||
        trimmedPassword !== passwordRepeat.trim()
      ) {
        setLocalError('Пароли не совпадают')
        return
      }
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
        setLocalError('Пароль должен содержать минимум одну заглавную букву')
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
      if (mode === 'login') {
        setLocalError('Пароль введен неверно, попробуйте еще раз.')
      } else {
        setLocalError('Данная почта уже используется. Попробуйте войти.')
      }
    }
  }

  const errorMessage = localError ?? lastError

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-[#D9D9D9] bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-3 top-3 text-[#202020]/50 hover:text-[#202020]"
          aria-label="Закрыть"
        >
          <span className="text-xl leading-none">&times;</span>
        </button>

        <div className="flex flex-col items-center px-8 pt-8 pb-6 sm:px-10 sm:pt-10 sm:pb-8">
          <div className="mb-6 flex items-center justify-center sm:mb-8">
            <img
              src="/logo.png"
              alt="SkyFitnessPro"
              className="h-9 w-auto"
              width={40}
              height={36}
            />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSubmit(e)
            }}
            className="flex w-full flex-col items-stretch gap-4"
            autoComplete="on"
          >
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-[#202020]"
                htmlFor={`${formId}-email`}
              >
                {mode === 'login' ? 'Логин' : 'Эл. почта'}
              </label>
              <input
                id={`${formId}-email`}
                type="email"
                name="email"
                placeholder="user@example.com"
                autoComplete="email"
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
                name="password"
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="h-11 w-full rounded-xl border border-[#D9D9D9] bg-white px-3 text-sm text-[#202020] outline-none focus:border-[#BCEC30] focus:ring-1 focus:ring-[#BCEC30]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-[#202020]"
                  htmlFor={`${formId}-password-repeat`}
                >
                  Повторите пароль
                </label>
                <input
                  id={`${formId}-password-repeat`}
                  type="password"
                  name="passwordRepeat"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="h-11 w-full rounded-xl border border-[#D9D9D9] bg-white px-3 text-sm text-[#202020] outline-none focus:border-[#BCEC30] focus:ring-1 focus:ring-[#BCEC30]"
                  value={passwordRepeat}
                  onChange={(e) => setPasswordRepeat(e.target.value)}
                />
              </div>
            )}

            {errorMessage && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-1">
              <button
                type="submit"
                disabled={isLoading || isDisabled}
                className={cn(
                  'rounded-[28px] border-none px-5 py-3.5 text-sm font-medium transition-colors',
                  !isDisabled &&
                    !isLoading &&
                    'bg-[#BCEC30] text-black hover:bg-[#c8f050] active:bg-black active:text-white',
                  (isLoading || isDisabled) &&
                    'cursor-not-allowed bg-[#ebebeb] text-[#202020]/40 hover:bg-[#ebebeb] active:bg-[#ebebeb] active:text-[#202020]/40',
                )}
              >
                {isLoading
                  ? 'Секунду...'
                  : mode === 'login'
                    ? 'Войти'
                    : 'Зарегистрироваться'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  handleModeSwitch(mode === 'login' ? 'register' : 'login')
                }}
                className={cn(
                  'rounded-[28px] border-2 px-5 py-3.5 text-sm font-medium transition-colors',
                  !isDisabled
                    ? 'border-black bg-white text-black hover:bg-[#f5f5f5] active:bg-[#e5e5e5]'
                    : 'cursor-not-allowed border-[#D9D9D9] bg-white text-[#202020]/40 hover:bg-white active:bg-white',
                )}
              >
                {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
