import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ProfileCourseCard, ProfileHeaderCard } from '../../components/ProfilePage'
import { WorkoutSelectionModal } from '../../components/WorkoutSelectionModal'
import {
  fetchCourses,
  removeCourseForUser,
  resetCourseProgress,
  type ApiCourse,
} from '../../shared/api/courses'
import { fetchCourseProgress, type CourseProgress } from '../../shared/api/workouts'
import { useAuth } from '../../shared/auth/AuthContext'

import styles from './style.module.css'

export function ProfilePage() {
  const navigate = useNavigate()
  const { status, user, token, logout } = useAuth()
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [progressMap, setProgressMap] = useState<Partial<Record<string, CourseProgress>>>(
    {},
  )
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
          (c) =>
            Array.isArray(user.selectedCourses) && user.selectedCourses.includes(c._id),
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
      const next: Partial<Record<string, CourseProgress>> = {}
      for (const course of courses) {
        if (cancelled) break
        try {
          const p = await fetchCourseProgress(course._id, token)
          next[course._id] = p
        } catch {
          continue
        }
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
      setProgressMap((prev) => ({
        ...prev,
        [courseId]: { courseId, workoutsProgress: [] },
      }))
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

  if (!user) return null

  const displayName = user.email.split('@')[0] || 'Пользователь'

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Профиль</h1>

      <ProfileHeaderCard
        displayName={displayName}
        email={user.email}
        onLogout={handleLogout}
      />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Мои курсы</h2>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.grid}>
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={styles.skeleton} />
            ))}

          {!loading &&
            courses.map((course) => {
              return (
                <ProfileCourseCard
                  key={course._id}
                  course={course}
                  progress={progressMap[course._id]}
                  removing={removingId === course._id}
                  resetting={resettingId === course._id}
                  onRemove={handleRemove}
                  onResetProgress={handleResetProgress}
                  onOpenWorkoutModal={setWorkoutModalCourse}
                />
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
