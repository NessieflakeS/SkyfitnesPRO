import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../../shared/auth/AuthContext'
import { cn } from '../../shared/lib/cn'

const linkBase =
  'inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors'

export function Header() {
  const navigate = useNavigate()
  const { status, user, logout } = useAuth()
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

  return (
    <header className="sticky top-0 z-50 border-b border-[#D9D9D9] bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-slate-900 text-white">
            SF
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-black">SkyFitnessPro</div>
            <div className="text-[18px] text-black/50">
              Онлайн-тренировки для занятий дома
            </div>
          </div>
        </NavLink>

        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                linkBase,
                isActive
                  ? 'bg-[#BCEC30] text-black'
                  : 'text-[#202020] hover:bg-[#f7f7f7]',
              )
            }
            end
          >
            Курсы
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                linkBase,
                isActive
                  ? 'bg-[#BCEC30] text-black'
                  : 'text-[#202020] hover:bg-[#f7f7f7]',
              )
            }
          >
            Профиль
          </NavLink>
          {status === 'authenticated' && user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className={cn(
                  linkBase,
                  'text-[#202020] hover:bg-[#f7f7f7]',
                  menuOpen && 'bg-[#f7f7f7]',
                )}
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <span className="hidden sm:inline">{user.email}</span>
                <span className="sm:ml-1.5">
                  {menuOpen ? (
                    <span className="inline-block size-4 align-middle">▲</span>
                  ) : (
                    <span className="inline-block size-4 align-middle">▼</span>
                  )}
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
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center rounded-[46px] px-6 py-4 text-[18px] font-normal transition-colors',
                  isActive
                    ? 'bg-[#BCEC30] text-black'
                    : 'bg-[#BCEC30] text-black hover:bg-[#99D100]',
                )
              }
            >
              Войти
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
