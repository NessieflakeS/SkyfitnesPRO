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
import { useModal } from '../../shared/ui/ModalContext'

export function CoursePage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { status, user, token } = useAuth()
  const { openAuthModal } = useModal()

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

    void fetchCourse(courseId, token)
      .then((courseData) => {
        if (cancelled) return
        setCourse(courseData)
        return fetchCourseWorkouts(courseId, token)
          .then((w) => w ?? [])
          .catch(() => [] as ApiWorkoutShort[])
      })
      .then((workoutsData) => {
        if (cancelled) return
        setWorkouts(workoutsData)
      })
      .catch(() => {
        if (cancelled) return
        setError('Не удалось загрузить курс')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [courseId, token])

  if (!courseId) {
    return (
      <div className="rounded-2xl border border-[#D9D9D9] bg-white p-4 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:rounded-[30px] sm:p-6">
        <h1 className="text-base font-semibold text-[#202020] sm:text-lg">
          Курс не найден
        </h1>
        <p className="mt-2 text-xs text-[#202020]/70 sm:text-sm">
          Возможно, ссылка устарела. Вернитесь к списку курсов.
        </p>
        <div className="mt-4 sm:mt-5">
          <Link
            className="inline-flex items-center rounded-[46px] bg-[#BCEC30] px-4 py-3 text-base font-normal text-black hover:bg-[#99D100] sm:px-6 sm:py-4 sm:text-[18px]"
            to="/"
          >
            Перейти к курсам
          </Link>
        </div>
      </div>
    )
  }

  const mapped = course ? mapApiCourseToCourse(course) : null
  const isOwned =
    !!user && !!course && Array.isArray(user.selectedCourses) && user.selectedCourses.includes(course._id)

  const handleAddCourse = async () => {
    setAddError(null)

    if (status !== 'authenticated' || !token) {
      openAuthModal(courseId ?? undefined)
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
        <div className="h-40 animate-pulse rounded-[30px] bg-[#f7f7f7]" />
        <div className="h-40 animate-pulse rounded-[30px] bg-[#f7f7f7]" />
      </div>
    )
  }

  if (error || !course || !mapped) {
    return (
      <div className="rounded-2xl border border-[#D9D9D9] bg-white p-4 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:rounded-[30px] sm:p-6">
        <h1 className="text-base font-semibold text-[#202020] sm:text-lg">
          Курс не найден
        </h1>
        <p className="mt-2 text-xs text-[#202020]/70 sm:text-sm">
          {error ?? 'Возможно, ссылка устарела. Вернитесь к списку курсов.'}
        </p>
        <div className="mt-4 sm:mt-5">
          <Link
            className="inline-flex items-center rounded-[46px] bg-[#BCEC30] px-4 py-3 text-base font-normal text-black hover:bg-[#99D100] sm:px-6 sm:py-4 sm:text-[18px]"
            to="/"
          >
            Перейти к курсам
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="overflow-hidden rounded-2xl border border-[#D9D9D9] bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:rounded-[30px]">
        <div className={`h-28 bg-gradient-to-br sm:h-36 ${mapped.coverColor}`} aria-hidden />
        <div className="space-y-4 p-4 sm:space-y-5 sm:p-6 md:p-10">
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight text-[#202020] sm:text-2xl md:text-[32px]">
              {mapped.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f7f7f7] px-[10px] py-2 text-sm text-[#202020]">
                {getCourseLevelLabel(mapped.level)}
              </span>
              <span className="rounded-full bg-[#f7f7f7] px-[10px] py-2 text-sm text-[#202020]">
                {mapped.durationDays} дней
              </span>
              <span className="rounded-full bg-[#f7f7f7] px-[10px] py-2 text-sm text-[#202020]">
                {mapped.dailyMinutesFrom}-{mapped.dailyMinutesTo} мин/день
              </span>
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-[#202020]/90">
            {mapped.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {mapped.fitting.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#f7f7f7] px-3 py-1 text-xs font-medium text-[#202020]"
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
            <div className="rounded-2xl border border-[#D9D9D9] bg-[#f7f7f7] p-4 text-sm text-[#202020]">
              <div className="font-semibold">Для добавления курса нужно войти</div>
              <div className="mt-1 text-[#202020]/80">
                Авторизуйтесь, чтобы сохранить курс в своём профиле и отслеживать
                прогресс.
              </div>
              <div className="mt-3">
                <Button onClick={() => openAuthModal(courseId ?? undefined)}>
                  Войти или зарегистрироваться
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-base font-semibold text-[#202020] sm:text-lg">
            Тренировки курса
          </h2>
          <div className="text-xs text-[#202020]/60">{workouts.length} шт.</div>
        </div>

        {workouts.length === 0 && !token && (
          <p className="rounded-2xl border border-[#D9D9D9] bg-[#f7f7f7] px-4 py-3 text-sm text-[#202020]/80">
            Войдите в аккаунт, чтобы видеть список тренировок.
          </p>
        )}
        <div className="grid gap-2 sm:gap-3">
          {workouts.map((workout) => (
            <Link
              key={workout._id}
              to={`/workouts/${workout._id}`}
              state={courseId ? { courseId } : undefined}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-[#D9D9D9] bg-white p-4 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] transition-colors hover:bg-[#fafafa] sm:rounded-[30px] sm:gap-4 sm:p-5"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-[#202020]">
                  {workout.name}
                </div>
              </div>
              <div className="shrink-0 text-sm font-semibold text-[#202020]">→</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
