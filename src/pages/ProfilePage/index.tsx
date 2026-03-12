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
import { getCourseCardImagePath } from '../../shared/config/courseImages'
import { getCourseBannerColor } from '../../shared/mappers/courseMapper'



const IconCalendar = () => (
  <svg
    className="size-[18px] shrink-0 text-[#202020]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const IconClock = () => (
  <svg
    className="size-[18px] shrink-0 text-[#202020]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const IconSignal = () => (
  <svg className="size-[18px] shrink-0 text-[#202020]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 20h4V10H2v10zm6 0h4V4H8v16zm6 0h4v-7h-4v7zm6 0h4V2h-4v18z" />
  </svg>
)

const IconWave = () => (
  <svg
    className="size-4 shrink-0 text-[#202020]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M2 12c0 0 3-6 10-6s10 6 10 6-3 6-10 6-10-6-10-6z" />
    <path d="M2 12c0 0 3 6 10 6s10-6 10-6" />
  </svg>
)

const IconPerson = () => (
  <svg
    className="size-10 text-[#202020]/50 sm:size-12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </svg>
)

const IconMinus = () => (
  <svg
    className="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

function RemoveCourseButton({
  courseId,
  disabled,
  onRemove,
}: {
  courseId: string
  disabled: boolean
  onRemove: (id: string) => void
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onRemove(courseId)
        }}
        disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#202020] shadow hover:bg-white disabled:opacity-50 sm:size-9"
        title="Удалить курс"
        aria-label="Удалить курс"
      >
        <IconMinus />
      </button>
      {showTooltip && (
        <span
          className="absolute right-0 top-full z-20 mt-1 whitespace-nowrap rounded bg-[#202020] px-2 py-1 text-xs text-white"
          role="tooltip"
        >
          Удалить курс
        </span>
      )}
    </div>
  )
}

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
        const owned = all.filter(
          (c) => Array.isArray(user.selectedCourses) && user.selectedCourses.includes(c._id),
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
        } catch {}
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
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#e5e5e5] sm:size-20">
            <IconPerson />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="truncate text-lg font-bold text-[#202020] sm:text-xl">
              {displayName}
            </div>
            <div className="truncate text-sm text-[#202020]/70">
              Логин: {user.email}
            </div>
            <div className="pt-1">
              <Button variant="secondary" onClick={handleLogout} className="sm:shrink-0">
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#202020]">Мои курсы</h2>

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
                className="h-64 animate-pulse rounded-2xl border border-[#D9D9D9] bg-[#f7f7f7] sm:rounded-[30px] sm:h-72"
              />
            ))}

          {!loading &&
            courses.map((course) => {
              const progress = progressMap[course._id]
              const courseWorkoutIds = course.workouts ?? []
              const total = courseWorkoutIds.length
              const completed =
                progress?.workoutsProgress?.filter(
                  (w) =>
                    w.workoutCompleted === true && courseWorkoutIds.includes(w.workoutId),
                ).length ?? 0
              const percent = total > 0 ? Math.round((completed / total) * 100) : 0

              const buttonText =
                percent === 0
                  ? 'Начать тренировки'
                  : percent === 100
                    ? 'Начать заново'
                    : 'Продолжить'

              const handleCardAction = async () => {
                if (percent === 100) {
                  await handleResetProgress(course._id)
                  setWorkoutModalCourse(course)
                } else {
                  setWorkoutModalCourse(course)
                }
              }

              return (
                <article
                  key={course._id}
                  className="relative overflow-hidden rounded-2xl bg-white pb-[15px] shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] transition-shadow hover:shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.18)] sm:rounded-[30px]"
                >
                  <div className="relative h-36 overflow-hidden sm:h-44 md:h-52 lg:h-[260px]">
                    <div className={`absolute inset-0 ${getCourseBannerColor(course.nameRU)}`} aria-hidden />
                    <img
                      key={course._id}
                      src={getCourseCardImagePath(course.nameRU)}
                      alt={course.nameRU}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <div className="absolute right-2 top-2 z-10 sm:right-3 sm:top-3">
                      <RemoveCourseButton
                        courseId={course._id}
                        disabled={removingId === course._id}
                        onRemove={(id) => void handleRemove(id)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 px-4 pt-4 sm:gap-2 sm:px-5 sm:pt-5 md:px-6 lg:px-[30px] lg:pt-5">
                    <h3 className="text-xl font-medium leading-[1.1] text-black sm:text-2xl md:text-[32px]">
                      {course.nameRU}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-[50px] bg-[#f7f7f7] px-2 py-1.5 text-xs font-normal text-[#202020] sm:gap-2 sm:px-[10px] sm:py-2.5 sm:text-[16px]">
                        <IconCalendar />
                        {course.durationInDays} дней
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-[50px] bg-[#f7f7f7] px-2 py-1.5 text-xs font-normal text-[#202020] sm:gap-2 sm:px-[10px] sm:py-2.5 sm:text-[16px]">
                        <IconClock />
                        {course.dailyDurationInMinutes.from}–
                        {course.dailyDurationInMinutes.to} мин/день
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-[50px] bg-[#f7f7f7] px-2 py-1.5 text-xs font-normal text-[#202020] sm:gap-2 sm:px-[10px] sm:py-2.5 sm:text-[16px]">
                        <IconSignal />
                        {course.difficulty}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs text-[#202020]">
                        <span>Прогресс</span>
                        <span>
                          {completed} из {total} ({percent}%)
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
                        <div
                          className="h-full rounded-full bg-[#3b82f6] transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                    <Button
                      fullWidth
                      onClick={() => void handleCardAction()}
                      disabled={
                        (percent === 100 && resettingId === course._id) ||
                        (percent < 100 && !course.workouts?.length)
                      }
                    >
                      {percent === 100 && resettingId === course._id
                        ? 'Сброс…'
                        : buttonText}
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
