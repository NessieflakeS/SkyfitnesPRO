import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../../shared/auth/AuthContext'
import { cn } from '../../shared/lib/cn'
import { useModal } from '../../shared/ui/ModalContext'

import styles from './style.module.css'

export function Header() {
  const navigate = useNavigate()
  const { status, user, logout } = useAuth()
  const { openAuthModal } = useModal()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [menuOpen])

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    void navigate('/')
  }

  const displayName =
    status === 'authenticated' && user ? user.email.split('@')[0] || 'Пользователь' : ''

  return (
    <header className={styles.root}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.brandLink} title="На главную">
          <img
            src="/logo.png"
            alt="SkyFitnessPro"
            className={styles.logo}
            width={220}
            height={35}
          />
          <span className={styles.subtitle}>Онлайн-тренировки для занятий дома</span>
        </NavLink>

        <div className={styles.actions}>
          {status === 'authenticated' && user ? (
            <div className={styles.menuWrap} ref={menuRef}>
              {menuOpen ? (
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className={styles.menuButton}
                  aria-expanded="true"
                  aria-haspopup="menu"
                >
                  <div className={styles.avatar} aria-hidden>
                    <span className={styles.avatarLetter}>
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={styles.displayName}>{displayName}</span>
                  <span className={cn(styles.chevron, styles.chevronOpen)} aria-hidden>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  className={styles.menuButton}
                  aria-expanded="false"
                  aria-haspopup="menu"
                >
                  <div className={styles.avatar} aria-hidden>
                    <span className={styles.avatarLetter}>
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={styles.displayName}>{displayName}</span>
                  <span className={styles.chevron} aria-hidden>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>
              )}
              {menuOpen && (
                <div role="menu" className={styles.menu}>
                  <NavLink
                    to="/profile"
                    role="menuitem"
                    className={styles.menuItemLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    Профиль
                  </NavLink>
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.menuItemButton}
                    onClick={handleLogout}
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal()}
              className={styles.loginButton}
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
