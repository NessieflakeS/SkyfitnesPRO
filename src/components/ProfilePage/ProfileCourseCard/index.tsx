import { getCourseCardImagePath } from '../../../shared/config/courseImages'
import { Button } from '../../Button'
import { RemoveCourseButton } from '../RemoveCourseButton'

import styles from './style.module.css'

import type { ApiCourse } from '../../../shared/api/courses'
import type { CourseProgress } from '../../../shared/api/workouts'

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
        <div className={styles.imageFallback} aria-hidden />
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
            <img src="/Icon_calendar.svg" alt="" className={styles.icon} aria-hidden />
            {course.durationInDays} дней
          </span>
          <span className={styles.chip}>
            <img src="/Icon_clock.svg" alt="" className={styles.icon} aria-hidden />
            {course.dailyDurationInMinutes.from}–{course.dailyDurationInMinutes.to}{' '}
            мин/день
          </span>
          <span className={styles.chip}>
            <img src="/Group_signal.png" alt="" className={styles.icon} aria-hidden />
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
