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

type LocationState = { courseId?: string }

export function WorkoutPage() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const courseId = (location.state as LocationState | null)?.courseId
  const { status, token } = useAuth()

  const [workout, setWorkout] = useState<ApiWorkout | null>(null)
  const [courseName, setCourseName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number[]>([])
  const [progressModalOpen, setProgressModalOpen] = useState(false)

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

    void fetchWorkout(workoutId)
      .then((data) => {
        if (cancelled) return
        setWorkout(data)
        setProgress(
          data.exercises.map((ex) => (typeof ex.quantity === 'number' ? ex.quantity : 0)),
        )
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
  }, [workoutId])

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
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h1 className="text-lg font-semibold">Тренировка не найдена</h1>
        <p className="mt-2 text-sm text-slate-600">
          Проверьте ссылку или вернитесь к курсам.
        </p>
        <div className="mt-5">
          <Link className="text-sm font-semibold text-slate-900 underline" to="/">
            Перейти к курсам
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
        <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    )
  }

  if (error || !workout) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h1 className="text-lg font-semibold">Тренировка не найдена</h1>
        <p className="mt-2 text-sm text-slate-600">
          {error ?? 'Проверьте ссылку или вернитесь к курсам.'}
        </p>
        <div className="mt-5">
          <Link className="text-sm font-semibold text-slate-900 underline" to="/">
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
  }

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <div className="text-xs font-medium text-slate-500">
          {courseName ? <span>{courseName}</span> : 'Курс'} / Тренировка
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {workout.name}
        </h1>
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="aspect-video overflow-hidden rounded-3xl border border-slate-200 bg-black shadow-sm">
            <iframe
              className="h-full w-full"
              src={workout.video}
              title={workout.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Упражнения</div>
            <div className="mt-4 space-y-3">
              {workout.exercises.map((ex, idx) => (
                <div
                  key={ex._id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <div className="min-w-0 truncate text-sm font-medium text-slate-900">
                    {idx + 1}. {ex.name}
                  </div>
                  <div className="shrink-0 text-sm text-slate-500">
                    {progress[idx] ?? 0} / {ex.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button fullWidth onClick={() => setProgressModalOpen(true)}>
                Заполнить прогресс
              </Button>
            </div>
          </div>
        </div>
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
