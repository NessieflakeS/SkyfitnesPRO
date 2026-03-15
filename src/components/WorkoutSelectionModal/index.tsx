import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  fetchCourseWorkouts,
  type ApiCourse,
  type ApiWorkoutShort,
} from '../../shared/api/courses'
import { fetchCourseProgress, type CourseProgress } from '../../shared/api/workouts'
import { cn } from '../../shared/lib/cn'
import { Button } from '../Button'

import styles from './style.module.css'

type Props = {
  course: ApiCourse
  token: string
  onClose: () => void
}

const IconCheck = ({ className }: { className?: string }) => (
  <svg
    className={cn(styles.icon, className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M5 12l5 5L20 7" />
  </svg>
)

export function WorkoutSelectionModal({ course, token, onClose }: Props) {
  const navigate = useNavigate()
  const [workouts, setWorkouts] = useState<ApiWorkoutShort[]>([])
  const [progress, setProgress] = useState<CourseProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setWorkouts([])
      return
    }
    let cancelled = false
    setLoading(true)
    void Promise.all([
      fetchCourseWorkouts(course._id, token),
      fetchCourseProgress(course._id, token),
    ])
      .then(([workoutsData, progressData]) => {
        if (cancelled) return
        const list = workoutsData
        const orderIds = course.workouts
        const ordered = list.slice().sort((a, b) => {
          const i = orderIds.indexOf(a._id)
          const j = orderIds.indexOf(b._id)
          return (i === -1 ? 999 : i) - (j === -1 ? 999 : j)
        })
        setWorkouts(ordered)
        setProgress(progressData)
        const wp = progressData.workoutsProgress
        const firstIncomplete = ordered.find(
          (w) => !wp?.find((p) => p.workoutId === w._id)?.workoutCompleted,
        )
        const firstId = firstIncomplete?._id ?? ordered[0]?._id
        setSelectedId(firstId)
      })
      .catch(() => {
        if (cancelled) return
        setWorkouts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [course._id, course.workouts, token])

  const getWorkoutStatus = (workoutId: string) => {
    const wp = progress?.workoutsProgress?.find((w) => w.workoutId === workoutId)
    return wp?.workoutCompleted ?? false
  }

  const handleStart = () => {
    if (!selectedId) return
    onClose()
    void navigate(`/workouts/${selectedId}`, {
      state: {
        courseId: course._id,
        workoutIndex: workouts.findIndex((w) => w._id === selectedId) + 1,
      },
    })
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Выберите тренировку</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Закрыть"
          >
            &times;
          </button>
        </div>

        <div className={styles.listWrap}>
          {loading ? (
            <div className={styles.skeletonList}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={styles.skeletonItem}>
                  <div className={styles.skeletonCircle} />
                  <div className={styles.skeletonLine} />
                </div>
              ))}
            </div>
          ) : (
            <ul className={styles.list}>
              {workouts.map((workout, index) => {
                const completed = getWorkoutStatus(workout._id)
                const selected = selectedId === workout._id
                const showCheck = completed || selected
                return (
                  <li key={workout._id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(workout._id)}
                      className={cn(
                        styles.itemButton,
                        selected && styles.itemButtonSelected,
                      )}
                    >
                      <span
                        className={cn(
                          styles.checkWrap,
                          showCheck ? styles.checkActive : styles.checkInactive,
                        )}
                      >
                        {showCheck && <IconCheck className={styles.checkIcon} />}
                      </span>
                      <div className={styles.itemContent}>
                        <div className={styles.itemTitle}>{workout.name}</div>
                        <div className={styles.itemMeta}>
                          {course.nameRU} / {index + 1} день
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className={styles.footer}>
          <Button fullWidth onClick={handleStart} disabled={!selectedId || loading}>
            Начать
          </Button>
        </div>
      </div>
    </div>
  )
}
