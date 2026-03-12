import { useState } from 'react'
import { Link } from 'react-router-dom'

import { addCourseForUser } from '../../shared/api/courses'
import { useAuth } from '../../shared/auth/AuthContext'
import { getCourseCardImagePath } from '../../shared/config/courseImages'
import { cn } from '../../shared/lib/cn'
import { getCourseLevelLabel } from '../../shared/mock/courses'
import { useModal } from '../../shared/ui/ModalContext'

import styles from './style.module.css'

import type { Course } from '../../shared/types/fitness'

const IconCalendar = () => (
  <svg
    className={styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const IconClock = () => (
  <svg
    className={styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)
const IconSignal = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 20h4V10H2v10zm6 0h4V4H8v16zm6 0h4v-7h-4v7zm6 0h4V2h-4v18z" />
  </svg>
)

function AddCourseButton({ courseId }: { courseId: string }) {
  const { status, token, refreshUser } = useAuth()
  const { openAuthModal } = useModal()
  const [adding, setAdding] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (status !== 'authenticated' || !token) {
      openAuthModal(courseId)
      return
    }
    setAdding(true)
    addCourseForUser(courseId, token)
      .then(() => refreshUser())
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : ''
        if (msg.includes('Курс уже был добавлен')) void refreshUser()
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
          <div className={cn(styles.imageFallback, course.coverColor)} aria-hidden />
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
              <IconCalendar />
              {course.durationDays} дней
            </span>
            <span className={styles.metaChip}>
              <IconClock />
              {course.dailyMinutesFrom}-{course.dailyMinutesTo} мин/день
            </span>
            <span className={styles.metaChip}>
              <IconSignal />
              {getCourseLevelLabel(course.level)}
            </span>
          </div>
        </div>
      </Link>
      <AddCourseButton courseId={course.id} />
    </article>
  )
}
