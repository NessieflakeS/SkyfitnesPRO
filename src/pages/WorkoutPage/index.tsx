import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../components/Button'
import { fetchCourse } from '../../shared/api/courses'
import { fetchWorkout, fetchWorkoutProgress, saveWorkoutProgress, type ApiWorkout } from '../../shared/api/workouts'
import { useAuth } from '../../shared/auth/AuthContext'

export function WorkoutPage() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { status, token } = useAuth()

  const [workout, setWorkout] = useState<ApiWorkout | null>(null)
  const [courseName, setCourseName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [progressMessage, setProgressMessage] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      void navigate('/auth', {
        replace: true,
        state: { from: location.pathname },
      })
    }
  }, [status, navigate, location])

  useEffect(() => {
    let cancelled = false

    if (!workoutId) {
      return () => {
        cancelled = true
      }
    }
    setLoading(true)
    setError(null)

    void fetchWorkout(workoutId)
      .then(async (data) => {
        if (cancelled) return
        setWorkout(data)
        setProgress(
          data.exercises.map((ex) => (typeof ex.quantity === 'number' ? ex.quantity : 0)),
        )

        try {
          const course = await fetchCourse(data._id)
          if (!cancelled) {
            setCourseName(course.nameRU)
          }
        } catch {
        }
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
    let cancelled = false

    if (!token || !workout) {
      return () => {
        cancelled = true
      }
    }

    void fetchWorkoutProgress(workout._id, workout._id, token)
      .then((data) => {
        if (cancelled) return
        if (data.progressData?.length === workout.exercises.length) {
          setProgress(data.progressData)
        }
      })
      .catch(() => {
      })

    return () => {
      cancelled = true
    }
  }, [workoutId, token, workout])

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

  const handleProgressChange = (index: number, value: string) => {
    const numeric = Number(value.replace(/\D/g, ''))
    if (Number.isNaN(numeric)) return
    setProgress((prev) => prev.map((item, idx) => (idx === index ? numeric : item)))
  }

  const handleSaveProgress = async () => {
    if (!token) {
      void navigate('/auth', { state: { from: location.pathname } })
      return
    }

    try {
      setSaving(true)
      setProgressMessage(null)
      await saveWorkoutProgress(workout._id, workout._id, progress, token)
      setProgressMessage('Прогресс сохранён')
    } catch {
      setProgressMessage('Не удалось сохранить прогресс')
    } finally {
      setSaving(false)
    }
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
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900">
                      {idx + 1}. {ex.name}
                    </div>
                  </div>
                  <input
                    type="number"
                    min={0}
                    className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-sm"
                    value={progress[idx] ?? 0}
                    onChange={(event) => handleProgressChange(idx, event.target.value)}
                    aria-label={`Количество для упражнения ${ex.name}`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <Button
                fullWidth
                disabled={saving}
                onClick={() => void handleSaveProgress()}
              >
                {saving ? 'Сохранение…' : 'Заполнить прогресс'}
              </Button>
              {progressMessage && (
                <div className="text-xs text-slate-500">{progressMessage}</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
