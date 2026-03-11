import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/Button'
import { WorkoutSelectionModal } from '../../components/WorkoutSelectionModal'
import {
  fetchCourses,
  removeCourseForUser,
  resetCourseProgress,
  type ApiCourse,
} from '../../shared/api/courses'
import { fetchCourseProgress, type CourseProgress } from '../../shared/api/workouts'
import { useAuth } from '../../shared/auth/AuthContext'

export function ProfilePage() {
  const navigate = useNavigate()
  const { status, user, token, logout } = useAuth()
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [resettingId, setResettingId] = useState<string | null>(null)
  const [workoutModalCourse, setWorkoutModalCourse] = useState<ApiCourse | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      void navigate('/auth', { replace: true, state: { from: '/profile' } })
      return
    }
  }, [status, navigate])

  useEffect(() => {
    if (!user || !token) return

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchCourses(token)
      .then((all) => {
        if (cancelled) return
        const owned = all.filter((c) =>
          Array.isArray(user.selectedCourses) && user.selectedCourses.includes(c._id),
        )
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
  }, [user, token])

  useEffect(() => {
    if (!token || courses.length === 0) return
    let cancelled = false
    const loadProgress = async () => {
      const next: Record<string, CourseProgress> = {}
      for (const course of courses) {
        if (cancelled) break
        try {
          const p = await fetchCourseProgress(course._id, token)
          if (!cancelled) next[course._id] = p
        } catch {
          // ignore per-course errors
        }
      }
      if (!cancelled) setProgressMap((prev) => ({ ...prev, ...next }))
    }
    void loadProgress()
    return () => {
      cancelled = true
    }
  }, [token, courses])

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

  const handleResetProgress = async (courseId: string) => {
    if (!token) return
    setResettingId(courseId)
    try {
      await resetCourseProgress(courseId, token)
      setProgressMap((prev) => ({ ...prev, [courseId]: { courseId, workoutsProgress: [] } }))
    } catch {
      setError('Не удалось сбросить прогресс')
    } finally {
      setResettingId(null)
    }
  }

  const handleLogout = useCallback(() => {
    logout()
    void navigate('/')
  }, [logout, navigate])

  if (!user) {
    return null
  }

  const displayName = user.email?.split('@')[0] ?? 'Пользователь'

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold tracking-tight text-[#202020] sm:text-2xl">
        Профиль
      </h1>

      <section className="rounded-2xl border border-[#D9D9D9] bg-white p-4 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:rounded-[30px] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#BCEC30] text-2xl font-medium text-black sm:size-20">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="truncate text-lg font-semibold text-[#202020]">
              {displayName}
            </div>
            <div className="truncate text-sm text-[#202020]/70">{user.email}</div>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="sm:shrink-0">
            Выйти
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#202020]">Мои курсы</h2>
          <div className="text-xs text-[#202020]/60">
            {loading ? 'Загрузка…' : `${String(courses.length)} шт.`}
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-2xl border border-[#D9D9D9] bg-[#f7f7f7] sm:rounded-[30px] sm:h-48"
              />
            ))}

          {!loading &&
            courses.map((course) => {
              const progress = progressMap[course._id]
              const total = course.workouts?.length ?? 0
              const completed =
                progress?.workoutsProgress?.filter((w) => w.workoutCompleted).length ?? 0
              const percent = total > 0 ? Math.round((completed / total) * 100) : 0

              return (
                <article
                  key={course._id}
                  className="overflow-hidden rounded-2xl border border-[#D9D9D9] bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:rounded-[30px]"
                >
                  <div
                    className="h-20 bg-gradient-to-br from-slate-900 to-indigo-700 sm:h-24"
                    aria-hidden
                  />
                  <div className="space-y-3 p-4 sm:p-5">
                    <div
                      className="cursor-pointer text-sm font-semibold text-[#202020]"
                      onClick={() => setWorkoutModalCourse(course)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setWorkoutModalCourse(course)
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      {course.nameRU}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-[#202020]/60">
                        <span>Прогресс</span>
                        <span>{completed} / {total} тренировок</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#f7f7f7]">
                        <div
                          className="h-full rounded-full bg-[#BCEC30] transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {course.workouts?.length > 0 ? (
                      <Button fullWidth onClick={() => setWorkoutModalCourse(course)}>
                        Выбрать тренировку
                      </Button>
                    ) : (
                      <Button disabled fullWidth>
                        Выбрать тренировку
                      </Button>
                    )}

                    <Button
                      variant="secondary"
                      disabled={resettingId === course._id}
                      fullWidth
                      onClick={() => void handleResetProgress(course._id)}
                    >
                      {resettingId === course._id ? 'Сброс…' : 'Сбросить прогресс'}
                    </Button>

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
              )
            })}
        </div>

        {workoutModalCourse && token && (
          <WorkoutSelectionModal
            course={workoutModalCourse}
            token={token}
            onClose={() => setWorkoutModalCourse(null)}
          />
        )}
      </section>
    </div>
  )
}
