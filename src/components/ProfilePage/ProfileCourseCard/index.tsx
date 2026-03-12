import { getCourseCardImagePath } from '../../../shared/config/courseImages'
import { cn } from '../../../shared/lib/cn'
import { getCourseBannerColor } from '../../../shared/mappers/courseMapper'
import { Button } from '../../Button'
import { RemoveCourseButton } from '../RemoveCourseButton'

import styles from './style.module.css'

import type { ApiCourse } from '../../../shared/api/courses'
import type { CourseProgress } from '../../../shared/api/workouts'

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

type Props = {
  course: ApiCourse
  progress?: CourseProgress
  removing: boolean
  resetting: boolean
  onRemove: (courseId: string) => Promise<void>
  onResetProgress: (courseId: string) => Promise<void>
  onOpenWorkoutModal: (course: ApiCourse) => void
}

export function ProfileCourseCard({
  course,
  progress,
  removing,
  resetting,
  onRemove,
  onResetProgress,
  onOpenWorkoutModal,
}: Props) {
  const courseWorkoutIds = course.workouts
  const total = courseWorkoutIds.length
  const completed = (
    progress?.workoutsProgress?.filter(
      (w) => w.workoutCompleted === true && courseWorkoutIds.includes(w.workoutId),
    ) ?? []
  ).length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  const buttonText =
    percent === 0 ? 'Начать тренировки' : percent === 100 ? 'Начать заново' : 'Продолжить'

  const handleCardAction = async () => {
    if (percent === 100) {
      await onResetProgress(course._id)
      onOpenWorkoutModal(course)
      return
    }
    onOpenWorkoutModal(course)
  }

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <div
          className={cn(styles.imageFallback, getCourseBannerColor(course.nameRU))}
          aria-hidden
        />
        <img
          key={course._id}
          src={getCourseCardImagePath(course.nameRU)}
          alt={course.nameRU}
          className={styles.cover}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className={styles.removeButtonWrap}>
          <RemoveCourseButton
            courseId={course._id}
            disabled={removing}
            onRemove={(id) => void onRemove(id)}
          />
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{course.nameRU}</h3>
        <div className={styles.chips}>
          <span className={styles.chip}>
            <IconCalendar />
            {course.durationInDays} дней
          </span>
          <span className={styles.chip}>
            <IconClock />
            {course.dailyDurationInMinutes.from}–{course.dailyDurationInMinutes.to}{' '}
            мин/день
          </span>
          <span className={styles.chip}>
            <IconSignal />
            {course.difficulty}
          </span>
        </div>
        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>Прогресс {String(percent)}%</div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressValue}
              style={{ width: `${String(percent)}%` }}
            />
          </div>
        </div>
        <Button
          fullWidth
          className={styles.actionButton}
          onClick={() => void handleCardAction()}
          disabled={
            (percent === 100 && resetting) || (percent < 100 && !course.workouts.length)
          }
        >
          {percent === 100 && resetting ? 'Сброс…' : buttonText}
        </Button>
      </div>
    </article>
  )
}
