import { useId, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/Button'
import { useAuth } from '../../shared/auth/AuthContext'
import { cn } from '../../shared/lib/cn'

import styles from './style.module.css'

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
      setLocalError(mode === 'login' ? 'Ошибка входа' : 'Ошибка регистрации')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>
            Используется реальное API. Требования к паролю: минимум 6 символов, минимум 2
            спецсимвола и минимум 1 заглавная буква.
          </p>

          <div className={styles.tabs}>
            <button
              type="button"
              onClick={() => {
                setMode('login')
                clearError()
                setLocalError(null)
              }}
              className={cn(
                styles.tabButton,
                mode === 'login' ? styles.tabButtonActive : styles.tabButtonIdle,
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
                styles.tabButton,
                mode === 'register' ? styles.tabButtonActive : styles.tabButtonIdle,
              )}
            >
              Регистрация
            </button>
          </div>
        </div>

        <form
          className={styles.form}
          aria-labelledby={formId}
          onSubmit={(event) => {
            void handleSubmit(event)
          }}
        >
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-email`}>
              Email
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              placeholder="user@example.com"
              className={styles.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-password`}>
              Пароль
            </label>
            <input
              id={`${formId}-password`}
              type="password"
              placeholder="••••••••"
              className={styles.input}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {mode === 'register' && (
            <div className={styles.passwordHint}>
              Пароль: не менее 6 символов, не менее двух спецсимволов и не менее одной
              заглавной буквы.
            </div>
          )}

          {(localError ?? lastError) && (
            <div className={styles.error}>{localError ?? lastError}</div>
          )}

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>

          <div className={styles.agreement}>
            Нажимая кнопку, вы соглашаетесь с условиями сервиса.
          </div>
        </form>
      </div>
    </div>
  )
}
