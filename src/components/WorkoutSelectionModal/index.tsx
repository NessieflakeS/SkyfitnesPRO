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

type Props = {
  course: ApiCourse
  token: string
  onClose: () => void
}

const IconCheck = ({ className }: { className?: string }) => (
  <svg className={cn('size-5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
    Promise.all([fetchCourseWorkouts(course._id, token), fetchCourseProgress(course._id, token)])
      .then(([workoutsData, progressData]) => {
        if (cancelled) return
        const list = workoutsData ?? []
        const orderIds = course.workouts ?? []
        const ordered = list.slice().sort((a, b) => {
          const i = orderIds.indexOf(a._id)
          const j = orderIds.indexOf(b._id)
          return (i === -1 ? 999 : i) - (j === -1 ? 999 : j)
        })
        setWorkouts(ordered)
        setProgress(progressData ?? null)
        const firstIncomplete = ordered.find(
          (w) => !progressData?.workoutsProgress?.find((p) => p.workoutId === w._id)?.workoutCompleted,
        )
        setSelectedId(firstIncomplete?._id ?? ordered[0]?._id ?? null)
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

  const handleStart = () => {
    if (!selectedId) return
    onClose()
    navigate(`/workouts/${selectedId}`, {
      state: { courseId: course._id, workoutIndex: workouts.findIndex((w) => w._id === selectedId) + 1 },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="relative flex w-full max-w-lg flex-col rounded-t-2xl border border-[#D9D9D9] bg-white shadow-xl sm:max-h-[85vh] sm:rounded-[30px]">
        <div className="border-b border-[#D9D9D9] p-4 sm:p-6">
          <h2 className="text-center text-lg font-bold text-[#202020] sm:text-xl">
            Выберите тренировку
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-2xl text-[#202020]/50 hover:text-[#202020]"
            aria-label="Закрыть"
          >
            &times;
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto sm:max-h-[60vh]">
          {loading ? (
            <div className="space-y-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 border-b border-[#D9D9D9]/60 p-4">
                  <div className="size-6 shrink-0 rounded-full border-2 border-[#D9D9D9]" />
                  <div className="h-4 w-32 animate-pulse rounded bg-[#f7f7f7]" />
                </div>
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-[#D9D9D9]/60">
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
                        'flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-[#f7f7f7]',
                        selected && 'bg-[#f7f7f7]',
                      )}
                    >
                      <span
                        className={cn(
                          'flex size-6 shrink-0 items-center justify-center rounded-full border-2',
                          showCheck
                            ? 'border-[#BCEC30] bg-[#BCEC30]'
                            : 'border-[#202020]/30 bg-transparent',
                        )}
                      >
                        {showCheck && <IconCheck className="text-white" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-[#202020]">{workout.name}</div>
                        <div className="text-sm text-[#202020]/70">
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

        <div className="border-t border-[#D9D9D9] p-4 sm:p-6">
          <Button fullWidth onClick={handleStart} disabled={!selectedId || loading}>
            Начать
          </Button>
        </div>
      </div>
    </div>
  )
}
