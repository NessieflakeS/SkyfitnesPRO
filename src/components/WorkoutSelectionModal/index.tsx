import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  fetchCourseWorkouts,
  type ApiCourse,
  type ApiWorkoutShort,
} from '../../shared/api/courses'
import { fetchCourseProgress, type CourseProgress } from '../../shared/api/workouts'
import { cn } from '../../shared/lib/cn'
import { Button } from '../Button'

type Props = {
  course: ApiCourse
  token: string
  onClose: () => void
}

export function WorkoutSelectionModal({ course, token, onClose }: Props) {
  const [workouts, setWorkouts] = useState<ApiWorkoutShort[]>([])
  const [progress, setProgress] = useState<CourseProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([fetchCourseWorkouts(course._id), fetchCourseProgress(course._id, token)])
      .then(([workoutsData, progressData]) => {
        if (cancelled) return
        setWorkouts(workoutsData)
        setProgress(progressData)
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
  }, [course._id, token])

  const getWorkoutStatus = (workoutId: string) => {
    const wp = progress?.workoutsProgress?.find((w) => w.workoutId === workoutId)
    return wp?.workoutCompleted ?? false
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-[30px] border border-[#D9D9D9] bg-white shadow-xl">
        <div className="border-b border-[#D9D9D9] p-6">
          <h2 className="pr-8 text-xl font-bold text-[#202020]">Тренировки курса</h2>
          <p className="mt-1 text-sm text-[#202020]/70">{course.nameRU}</p>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-2xl text-[#202020]/50 hover:text-[#202020]"
            aria-label="Закрыть"
          >
            &times;
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-[#f7f7f7]" />
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {workouts.map((workout) => {
                const completed = getWorkoutStatus(workout._id)
                return (
                  <li key={workout._id}>
                    <Link
                      to={`/workouts/${workout._id}`}
                      state={{ courseId: course._id }}
                      onClick={onClose}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[#D9D9D9] bg-white p-4 text-left shadow-sm transition-colors hover:bg-[#f7f7f7]"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#202020]">
                        {workout.name}
                      </span>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                          completed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#f7f7f7] text-[#202020]/70',
                        )}
                      >
                        {completed ? 'Завершена' : 'Доступна'}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-[#D9D9D9] p-6">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  )
}
