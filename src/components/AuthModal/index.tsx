import { useId, useState } from 'react'

import { addCourseForUser } from '../../shared/api/courses'
import { useAuth } from '../../shared/auth/AuthContext'
import { cn } from '../../shared/lib/cn'
import { useModal } from '../../shared/ui/ModalContext'

import styles from './style.module.css'

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
      let newToken: string | null = null
      if (mode === 'login') {
        newToken = await login(trimmedEmail, trimmedPassword)
      } else {
        newToken = await register(trimmedEmail, trimmedPassword)
      }

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
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className={styles.modal}>
        <button
          type="button"
          onClick={closeAuthModal}
          className={styles.closeButton}
          aria-label="Закрыть"
        >
          <span className={styles.closeIcon}>&times;</span>
        </button>

        <div className={styles.content}>
          <div className={styles.logoWrap}>
            <img
              src="/logo.png"
              alt="SkyFitnessPro"
              className={styles.logo}
              width={40}
              height={36}
            />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const p = handleSubmit(e)
              void p
            }}
            className={styles.form}
          >
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-email`}>
                {mode === 'login' ? 'Логин' : 'Эл. почта'}
              </label>
              <input
                id={`${formId}-email`}
                type={mode === 'login' ? 'text' : 'email'}
                name={mode === 'login' ? 'username' : 'email'}
                placeholder={mode === 'login' ? 'Введите логин' : 'user@example.com'}
                autoComplete={mode === 'login' ? 'username' : 'email'}
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-password`}>
                Пароль
              </label>
              <input
                id={`${formId}-password`}
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {mode === 'register' && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${formId}-password-repeat`}>
                  Повторите пароль
                </label>
                <input
                  id={`${formId}-password-repeat`}
                  type="password"
                  name="passwordRepeat"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={styles.input}
                  value={passwordRepeat}
                  onChange={(e) => setPasswordRepeat(e.target.value)}
                />
              </div>
            )}

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

            <div className={styles.actions}>
              <button
                type="submit"
                disabled={isLoading || isDisabled}
                className={cn(
                  styles.submitButton,
                  !isDisabled && !isLoading
                    ? styles.submitButtonActive
                    : styles.submitButtonDisabled,
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
                  styles.switchButton,
                  !isDisabled ? styles.switchButtonActive : styles.switchButtonDisabled,
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
