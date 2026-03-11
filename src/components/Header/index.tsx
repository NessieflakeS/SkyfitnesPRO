import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../../shared/auth/AuthContext'
import { cn } from '../../shared/lib/cn'

const linkBase =
  'inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors'

export function Header() {
  const navigate = useNavigate()
  const { status, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    void navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-slate-900 text-white">
            SF
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">SkyFitnessPro</div>
            <div className="text-xs text-slate-500">тренировки онлайн</div>
          </div>
        </NavLink>

        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                linkBase,
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100',
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
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100',
              )
            }
          >
            Профиль
          </NavLink>
          {status === 'authenticated' && user ? (
            <div className="flex items-center gap-2">
              <div className="hidden text-xs text-slate-500 sm:block">{user.email}</div>
              <button
                type="button"
                onClick={handleLogout}
                className={cn(linkBase, 'text-slate-700 hover:bg-slate-100')}
              >
                Выйти
              </button>
            </div>
          ) : (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                cn(
                  linkBase,
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100',
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
