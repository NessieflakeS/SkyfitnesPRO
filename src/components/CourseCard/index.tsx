import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { addCourseForUser } from '../../shared/api/courses'
import { useAuth } from '../../shared/auth/AuthContext'
import { getCourseCardImagePath } from '../../shared/config/courseImages'
import { cn } from '../../shared/lib/cn'
import { getCourseLevelLabel } from '../../shared/mock/courses'
import { useModal } from '../../shared/ui/ModalContext'

import styles from './style.module.css'

import type { Course } from '../../shared/types/fitness'

function AddCourseButton({ courseId }: { courseId: string }) {
  const { status, token, refreshUser } = useAuth()
  const { openAuthModal } = useModal()
  const [adding, setAdding] = useState(false)
  const [feedback, setFeedback] = useState<{
    message: string
    variant: 'success' | 'info' | 'error'
  } | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const showFeedback = (message: string, variant: 'success' | 'info' | 'error') => {
    setFeedback({ message, variant })
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      setFeedback(null)
      timeoutRef.current = null
    }, 2200)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (status !== 'authenticated' || !token) {
      openAuthModal(courseId)
      return
    }
    setAdding(true)
    addCourseForUser(courseId, token)
      .then(() => {
        showFeedback('Курс добавлен', 'success')
        return refreshUser()
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : ''
        if (msg.includes('Курс уже был добавлен')) {
          showFeedback('Уже добавлен', 'info')
          void refreshUser()
          return
        }
        showFeedback('Ошибка добавления', 'error')
      })
      .finally(() => setAdding(false))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={adding}
      className={styles.addButton}
      title="Добавить курс"
      aria-label="Добавить курс"
    >
      <img src="/Icon_plus.svg" alt="" className={styles.addIcon} aria-hidden />
      {feedback && (
        <span
          className={cn(
            styles.inlineToast,
            feedback.variant === 'success' && styles.inlineToastSuccess,
            feedback.variant === 'info' && styles.inlineToastInfo,
            feedback.variant === 'error' && styles.inlineToastError,
          )}
          role="status"
        >
          {feedback.message}
        </span>
      )}
    </button>
  )
}

type Props = {
  course: Course
}

export function CourseCard({ course }: Props) {
  return (
    <article className={styles.card}>
      <Link to={`/courses/${course.id}`} className={styles.link}>
        <div className={styles.imageWrap}>
          <div className={styles.imageFallback} aria-hidden />
          <img
            key={course.id}
            src={getCourseCardImagePath(course.title)}
            alt={course.title}
            className={styles.coverImage}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{course.title}</h3>
          <div className={styles.metaList}>
            <span className={styles.metaChip}>
              <img src="/Icon_calendar.svg" alt="" className={styles.icon} aria-hidden />
              {course.durationDays} дней
            </span>
            <span className={styles.metaChip}>
              <img src="/Icon_clock.svg" alt="" className={styles.icon} aria-hidden />
              {course.dailyMinutesFrom}-{course.dailyMinutesTo} мин/день
            </span>
            <span className={styles.metaChip}>
              <img src="/Group_signal.png" alt="" className={styles.icon} aria-hidden />
              {getCourseLevelLabel(course.level)}
            </span>
          </div>
        </div>
      </Link>
      <AddCourseButton courseId={course.id} />
    </article>
  )
}
