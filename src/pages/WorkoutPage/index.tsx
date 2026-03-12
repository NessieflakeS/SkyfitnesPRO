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

import styles from './style.module.css'

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
      <div className={styles.notFoundCard}>
        <h1 className={styles.notFoundTitle}>Тренировка не найдена</h1>
        <p className={styles.notFoundText}>Проверьте ссылку или вернитесь к курсам.</p>
        <div className={styles.notFoundActions}>
          <Link className={styles.notFoundLink} to="/">
            Перейти к курсам
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingBlock} />
        <div className={styles.loadingBlock} />
      </div>
    )
  }

  if (error || !workout) {
    return (
      <div className={styles.notFoundCard}>
        <h1 className={styles.notFoundTitle}>Тренировка не найдена</h1>
        <p className={styles.notFoundText}>
          {error ?? 'Проверьте ссылку или вернитесь к курсам.'}
        </p>
        <div className={styles.notFoundActions}>
          <Link className={styles.notFoundLink} to="/">
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
    (ex, idx) => (progress[idx] ?? 0) > 0 && ex.quantity > 0,
  )

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{courseName ?? 'Тренировка'}</h1>

      <section className={styles.videoSection}>
        <div className={styles.videoWrap}>
          <iframe
            className={styles.iframe}
            src={workout.video}
            title={workout.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        {showSavedOverlay && (
          <div className={styles.overlay}>
            <div className={styles.overlayCard}>
              <p className={styles.overlayText}>Ваш прогресс засчитан!</p>
              <div className={styles.overlayIconWrap}>
                <span className={styles.overlayIconBg}>
                  <svg
                    className={styles.overlayIcon}
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

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          Упражнения тренировки{workoutIndex != null ? ` ${String(workoutIndex)}` : ''}
        </h2>
        {hasNoExercises ? (
          <div className={styles.emptyWrap}>
            <p className={styles.emptyText}>
              В этом уроке нет упражнений с повторениями. Отметьте урок как пройденный,
              чтобы зафиксировать прохождение в курсе.
            </p>
            <div className={styles.actions}>
              <Button
                fullWidth
                onClick={() => void handleMarkLessonComplete()}
                disabled={!courseId || markingComplete}
              >
                {markingComplete ? 'Сохранение…' : 'Отметить урок пройденным'}
              </Button>
              {markError && <p className={styles.markError}>{markError}</p>}
            </div>
          </div>
        ) : (
          <>
            <div className={styles.exerciseGrid}>
              {workout.exercises.map((ex, idx) => {
                const current = progress[idx] ?? 0
                const target = ex.quantity
                const percent = target > 0 ? Math.round((current / target) * 100) : 0
                return (
                  <div key={ex._id} className={styles.exerciseItem}>
                    <div className={styles.exerciseLabel}>
                      {ex.name} {String(percent)}%
                    </div>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressValue}
                        style={{ width: `${String(Math.min(percent, 100))}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={styles.actions}>
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
