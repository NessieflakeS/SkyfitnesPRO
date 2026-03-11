import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../../components/Button'
import {
  fetchCourses,
  removeCourseForUser,
  type ApiCourse,
} from '../../shared/api/courses'
import { useAuth } from '../../shared/auth/AuthContext'

export function ProfilePage() {
  const navigate = useNavigate()
  const { status, user, token } = useAuth()
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      void navigate('/auth', { replace: true, state: { from: '/profile' } })
      return
    }
  }, [status, navigate])

  useEffect(() => {
    if (!user) return

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchCourses()
      .then((all) => {
        if (cancelled) return
        const owned = all.filter((c) => user.selectedCourses.includes(c._id))
        setCourses(owned)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError('Не удалось загрузить курсы пользователя')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const handleRemove = async (courseId: string) => {
    if (!token) return
    setRemovingId(courseId)
    try {
      await removeCourseForUser(courseId, token)
      setCourses((prev) => prev.filter((c) => c._id !== courseId))
    } catch {
      setError('Не удалось удалить курс')
    } finally {
      setRemovingId(null)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Профиль</h1>
            <div className="text-sm text-slate-600">{user.email}</div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Мои курсы</h2>
          <div className="text-xs text-slate-500">
            {loading ? 'Загрузка…' : `${String(courses.length)} шт.`}
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
              />
            ))}

          {!loading &&
            courses.map((course) => (
              <article
                key={course._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div
                  className="h-24 bg-gradient-to-br from-slate-900 to-indigo-700"
                  aria-hidden
                />
                <div className="space-y-3 p-5">
                  <div className="text-sm font-semibold text-slate-900">
                    {course.nameRU}
                  </div>
                  <div className="text-xs text-slate-500">
                    Тренировок: {course.workouts.length}
                  </div>

                  {course.workouts.length > 0 ? (
                    <Link
                      to={`/workouts/${course.workouts[0]}`}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                      Начать тренировку
                    </Link>
                  ) : (
                    <Button disabled fullWidth>
                      Начать тренировку
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    disabled={removingId === course._id}
                    fullWidth
                    onClick={() => void handleRemove(course._id)}
                  >
                    {removingId === course._id ? 'Удаление…' : 'Удалить курс'}
                  </Button>
                </div>
              </article>
            ))}
        </div>
      </section>
    </div>
  )
}
