import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../../shared/auth/AuthContext'
import { useModal } from '../../shared/ui/ModalContext'
import { cn } from '../../shared/lib/cn'

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

  const displayName = user?.email?.split('@')[0] ?? user?.email ?? 'Пользователь'

  return (
    <header className="sticky top-0 z-50 border-b border-[#D9D9D9] bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4 lg:px-8">
        <NavLink to="/" className="flex min-w-0 shrink-0 flex-col gap-0.5 sm:gap-1">
          <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white sm:size-9 sm:rounded-xl">
              <svg
                className="size-4 sm:size-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="truncate text-sm font-semibold text-black sm:text-base">
              SkyFitnessPro
            </span>
          </div>
          <div className="truncate text-xs text-black/50 sm:text-[18px] md:text-base">
            Онлайн-тренировки для занятий дома
          </div>
        </NavLink>

        <div className="flex shrink-0 items-center">
          {status === 'authenticated' && user ? (
            <div className="relative flex items-center gap-2" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full py-1 pr-2 transition-colors hover:bg-[#f7f7f7] sm:gap-3 sm:pr-3"
                aria-expanded={menuOpen ? 'true' : 'false'}
                aria-haspopup="true"
              >
                <div
                  className="size-8 shrink-0 rounded-full bg-[#BCEC30] sm:size-9"
                  aria-hidden
                >
                  <span className="flex size-full items-center justify-center text-sm font-medium text-black sm:text-base">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="max-w-[120px] truncate text-sm font-medium text-[#202020] sm:max-w-[180px]">
                  {displayName}
                </span>
                <span
                  className={cn(
                    'inline-block size-4 shrink-0 transition-transform',
                    menuOpen && 'rotate-180',
                  )}
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 min-w-48 rounded-xl border border-[#D9D9D9] bg-white py-1 shadow-lg">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-left text-sm text-[#202020] hover:bg-[#f7f7f7]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Профиль
                  </NavLink>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm text-[#202020] hover:bg-[#f7f7f7]"
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
              className="inline-flex items-center rounded-[46px] bg-[#BCEC30] px-4 py-2.5 text-base font-normal text-black transition-colors hover:bg-[#99D100] sm:px-6 sm:py-4 sm:text-[18px]"
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
