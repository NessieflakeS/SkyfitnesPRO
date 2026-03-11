import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../components/Button'
import {
  addCourseForUser,
  fetchCourse,
  fetchCourseWorkouts,
  type ApiCourse,
  type ApiWorkoutShort,
} from '../../shared/api/courses'
import { useAuth } from '../../shared/auth/AuthContext'
import { mapApiCourseToCourse } from '../../shared/mappers/courseMapper'
import { getCourseLevelLabel } from '../../shared/mock/courses'

export function CoursePage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { status, user, token } = useAuth()

  const [course, setCourse] = useState<ApiCourse | null>(null)
  const [workouts, setWorkouts] = useState<ApiWorkoutShort[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return

    let cancelled = false
    setLoading(true)
    setError(null)

    void Promise.all([fetchCourse(courseId), fetchCourseWorkouts(courseId)])
      .then(([courseData, workoutsData]) => {
        if (cancelled) return
        setCourse(courseData)
        setWorkouts(workoutsData)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError('Не удалось загрузить курс')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [courseId])

  if (!courseId) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h1 className="text-lg font-semibold">Курс не найден</h1>
        <p className="mt-2 text-sm text-slate-600">
          Возможно, ссылка устарела. Вернитесь к списку курсов.
        </p>
        <div className="mt-5">
          <Link className="text-sm font-semibold text-slate-900 underline" to="/">
            Перейти к курсам
          </Link>
        </div>
      </div>
    )
  }

  const mapped = course ? mapApiCourseToCourse(course) : null
  const isOwned = !!user && !!course && user.selectedCourses.includes(course._id)

  const handleAddCourse = async () => {
    setAddError(null)

    if (status !== 'authenticated' || !token) {
      void navigate('/auth', { state: { from: `/courses/${courseId}` } })
      return
    }

    if (!course) return

    try {
      setAdding(true)
      await addCourseForUser(course._id, token)
    } catch {
      setAddError('Не удалось добавить курс. Попробуйте позже.')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
        <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    )
  }

  if (error || !course || !mapped) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h1 className="text-lg font-semibold">Курс не найден</h1>
        <p className="mt-2 text-sm text-slate-600">
          {error ?? 'Возможно, ссылка устарела. Вернитесь к списку курсов.'}
        </p>
        <div className="mt-5">
          <Link className="text-sm font-semibold text-slate-900 underline" to="/">
            Перейти к курсам
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className={`h-36 bg-gradient-to-br ${mapped.coverColor}`} aria-hidden />
        <div className="space-y-5 p-6 sm:p-10">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {mapped.title}
            </h1>
            <div className="text-sm text-slate-600">
              {getCourseLevelLabel(mapped.level)} • {mapped.durationDays} дней •{' '}
              {mapped.dailyMinutesFrom}-{mapped.dailyMinutesTo} мин/день
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-slate-700">
            {mapped.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {mapped.fitting.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => void handleAddCourse()} disabled={adding}>
              {isOwned ? 'Курс уже добавлен' : 'Добавить курс'}
            </Button>
            <Button
              variant="secondary"
              disabled={!isOwned}
              onClick={() => {
                if (workouts.length > 0 && courseId) {
                  void navigate(`/workouts/${workouts[0]._id}`, {
                    state: { courseId },
                  })
                }
              }}
            >
              Начать тренировку
            </Button>
          </div>

          {addError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {addError}
            </div>
          )}

          {status !== 'authenticated' && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-semibold">Для добавления курса нужно войти</div>
              <div className="mt-1 text-slate-600">
                Авторизуйтесь, чтобы сохранить курс в своём профиле и отслеживать
                прогресс.
              </div>
              <div className="mt-3">
                <Link
                  className="text-sm font-semibold text-slate-900 underline"
                  to="/auth"
                >
                  Перейти к авторизации
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Тренировки курса</h2>
          <div className="text-xs text-slate-500">{workouts.length} шт.</div>
        </div>

        <div className="grid gap-3">
          {workouts.map((workout) => (
            <Link
              key={workout._id}
              to={`/workouts/${workout._id}`}
              state={courseId ? { courseId } : undefined}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:bg-slate-50"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">
                  {workout.name}
                </div>
              </div>
              <div className="shrink-0 text-sm font-semibold text-slate-900">→</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
