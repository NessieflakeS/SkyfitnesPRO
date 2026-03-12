import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../components/Button'
import { ProgressModal } from '../../components/ProgressModal'
import { fetchCourse } from '../../shared/api/courses'
import {
  fetchWorkout,
  fetchWorkoutProgress,
  saveWorkoutProgress,
  type ApiWorkout,
} from '../../shared/api/workouts'
import { useAuth } from '../../shared/auth/AuthContext'

type LocationState = { courseId?: string; workoutIndex?: number }

export function WorkoutPage() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  const courseId = state?.courseId
  const workoutIndex = state?.workoutIndex
  const { status, token } = useAuth()

  const [workout, setWorkout] = useState<ApiWorkout | null>(null)
  const [courseName, setCourseName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number[]>([])
  const [progressModalOpen, setProgressModalOpen] = useState(false)
  const [showSavedOverlay, setShowSavedOverlay] = useState(false)
  const [markingComplete, setMarkingComplete] = useState(false)
  const [markError, setMarkError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      void navigate('/auth', {
        replace: true,
        state: { from: location.pathname },
      })
    }
  }, [status, navigate, location])

  useEffect(() => {
    if (!workoutId) return

    let cancelled = false
    setLoading(true)
    setError(null)

    void fetchWorkout(workoutId, token)
      .then((data) => {
        if (cancelled) return
        setWorkout(data)
        setProgress(data.exercises.map(() => 0))
      })
      .catch(() => {
        if (cancelled) return
        setError('Не удалось загрузить тренировку')
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [workoutId, token])

  useEffect(() => {
    if (!courseId) return
    let cancelled = false
    void fetchCourse(courseId)
      .then((course) => {
        if (!cancelled) setCourseName(course.nameRU)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [courseId])

  useEffect(() => {
    if (!token || !workout || !courseId) return

    let cancelled = false

    void fetchWorkoutProgress(courseId, workout._id, token)
      .then((data) => {
        if (cancelled) return
        if (data.progressData?.length === workout.exercises.length) {
          setProgress(data.progressData ?? [])
        }
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [courseId, token, workout])

  if (!workoutId) {
    return (
      <div className="rounded-2xl border border-[#D9D9D9] bg-white p-4 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:rounded-[30px] sm:p-6">
        <h1 className="text-base font-semibold text-[#202020] sm:text-lg">
          Тренировка не найдена
        </h1>
        <p className="mt-2 text-xs text-[#202020]/70 sm:text-sm">
          Проверьте ссылку или вернитесь к курсам.
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-[30px] bg-[#f7f7f7]" />
        <div className="h-40 animate-pulse rounded-[30px] bg-[#f7f7f7]" />
      </div>
    )
  }

  if (error || !workout) {
    return (
      <div className="rounded-2xl border border-[#D9D9D9] bg-white p-4 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:rounded-[30px] sm:p-6">
        <h1 className="text-base font-semibold text-[#202020] sm:text-lg">
          Тренировка не найдена
        </h1>
        <p className="mt-2 text-xs text-[#202020]/70 sm:text-sm">
          {error ?? 'Проверьте ссылку или вернитесь к курсам.'}
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

  const handleSaveProgress = async (newProgress: number[]) => {
    if (!token || !courseId) return
    await saveWorkoutProgress(courseId, workout._id, newProgress, token)
    setProgress(newProgress)
    setProgressModalOpen(false)
    setShowSavedOverlay(true)
    setTimeout(() => setShowSavedOverlay(false), 2500)
  }

  const handleMarkLessonComplete = async () => {
    if (!token || !courseId) return
    setMarkError(null)
    setMarkingComplete(true)
    try {
      await saveWorkoutProgress(courseId, workout._id, [], token)
      setShowSavedOverlay(true)
      setTimeout(() => setShowSavedOverlay(false), 2500)
    } catch {
      setMarkError('Не удалось отметить урок')
    } finally {
      setMarkingComplete(false)
    }
  }

  const hasNoExercises = workout.exercises.length === 0
  const hasAnyProgress = workout.exercises.some(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- quantity can be undefined
    (ex, idx) => (progress[idx] ?? 0) > 0 && (ex.quantity ?? 0) > 0,
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-xl font-bold tracking-tight text-[#202020] sm:text-2xl md:text-3xl">
        {courseName ?? 'Тренировка'}
      </h1>

      <section className="relative">
        <div className="aspect-video overflow-hidden rounded-2xl border border-[#D9D9D9] bg-black shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:rounded-[30px]">
          <iframe
            className="h-full w-full"
            src={workout.video}
            title={workout.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        {showSavedOverlay && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20 sm:rounded-[30px]">
            <div className="rounded-2xl bg-white px-6 py-5 shadow-xl">
              <p className="text-center font-bold text-[#202020]">
                Ваш прогресс засчитан!
              </p>
              <div className="mt-3 flex justify-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#BCEC30]">
                  <svg
                    className="size-6 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#D9D9D9] bg-white p-4 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:rounded-[30px] sm:p-6">
        <h2 className="text-lg font-bold text-[#202020] sm:text-xl">
          Упражнения тренировки{workoutIndex != null ? ` ${String(workoutIndex)}` : ''}
        </h2>
        {hasNoExercises ? (
          <div className="mt-4">
            <p className="text-sm text-[#202020]/80">
              В этом уроке нет упражнений с повторениями. Отметьте урок как пройденный,
              чтобы зафиксировать прохождение в курсе.
            </p>
            <div className="mt-6">
              <Button
                fullWidth
                onClick={() => void handleMarkLessonComplete()}
                disabled={!courseId || markingComplete}
              >
                {markingComplete ? 'Сохранение…' : 'Отметить урок пройденным'}
              </Button>
              {markError && <p className="mt-2 text-sm text-rose-600">{markError}</p>}
            </div>
          </div>
        ) : (
          <>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workout.exercises.map((ex, idx) => {
                const current = progress[idx] ?? 0
                const target = typeof ex.quantity === 'number' ? ex.quantity : 0
                const percent = target > 0 ? Math.round((current / target) * 100) : 0
                return (
                  <div key={ex._id} className="space-y-1">
                    <div className="text-sm font-medium text-[#202020]">
                      {ex.name} {String(percent)}%
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-[#e5e7eb]">
                      <div
                        className="h-full rounded-full bg-[#3b82f6] transition-all"
                        style={{ width: `${String(Math.min(percent, 100))}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6">
              <Button
                fullWidth
                onClick={() => setProgressModalOpen(true)}
                disabled={!courseId}
              >
                {hasAnyProgress ? 'Обновить свой прогресс' : 'Заполнить свой прогресс'}
              </Button>
            </div>
          </>
        )}
      </section>

      {progressModalOpen && (
        <ProgressModal
          exercises={workout.exercises}
          initialProgress={progress}
          onSave={handleSaveProgress}
          onClose={() => setProgressModalOpen(false)}
          noCourseId={!courseId}
        />
      )}
    </div>
  )
}
