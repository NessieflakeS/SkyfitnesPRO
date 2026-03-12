import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../../shared/auth/AuthContext'
import { cn } from '../../shared/lib/cn'
import { useModal } from '../../shared/ui/ModalContext'

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
    status === 'authenticated' && user
      ? (user.email?.split('@')[0] ?? user.email ?? 'Пользователь') // eslint-disable-line @typescript-eslint/no-unnecessary-condition
      : ''
  const ariaExpandedValue = menuOpen ? 'true' : 'false'

  return (
    <header className="sticky top-0 z-50 border-b border-[#D9D9D9] bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4 lg:px-8">
        <NavLink
          to="/"
          className="flex min-w-0 shrink-0 flex-col gap-0.5 sm:gap-1"
          title="На главную"
        >
          <img
            src="/logo.png"
            alt="SkyFitnessPro"
            className="h-7 w-auto max-w-[120px] object-contain object-left sm:h-[32px] sm:max-w-[180px] md:h-[35px] md:max-w-[220px]"
            width={220}
            height={35}
          />
          <span className="hidden truncate text-[#202020]/70 sm:block sm:text-sm md:text-base">
            Онлайн-тренировки для занятий дома
          </span>
        </NavLink>

        <div className="flex shrink-0 items-center">
          {status === 'authenticated' && user ? (
            <div className="relative flex items-center gap-2" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full py-1 pr-2 transition-colors hover:bg-[#f7f7f7] sm:gap-3 sm:pr-3"
                aria-expanded={ariaExpandedValue}
                aria-haspopup="menu"
              >
                <div
                  className="size-8 shrink-0 rounded-full bg-[#BCEC30] sm:size-9"
                  aria-hidden
                >
                  <span className="flex size-full items-center justify-center text-sm font-medium text-black sm:text-base">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden max-w-[120px] truncate text-sm font-medium text-[#202020] sm:inline-block sm:max-w-[180px]">
                  {displayName}
                </span>
                <span
                  className={cn(
                    'inline-block size-4 shrink-0 transition-transform',
                    menuOpen && 'rotate-180',
                  )}
                  aria-hidden
                >
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
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-10 mt-1 min-w-48 rounded-xl border border-[#D9D9D9] bg-white py-1 shadow-lg"
                >
                  <NavLink
                    to="/profile"
                    role="menuitem"
                    className="block px-4 py-2 text-left text-sm text-[#202020] hover:bg-[#f7f7f7]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Профиль
                  </NavLink>
                  <button
                    type="button"
                    role="menuitem"
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
