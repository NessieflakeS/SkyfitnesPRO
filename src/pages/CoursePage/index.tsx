import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  CourseCtaSection,
  CourseNotFoundState,
  CtaRunnerImage,
  DirectionsSection,
  FittingSection,
  GreenStripeLayer,
} from '../../components/CoursePage'
import { addCourseForUser, fetchCourse, type ApiCourse } from '../../shared/api/courses'
import { useAuth } from '../../shared/auth/AuthContext'
import {
  getCourseBannerImagePath,
  getCourseCardImagePath,
} from '../../shared/config/courseImages'
import { cn } from '../../shared/lib/cn'
import {
  getCourseBannerColor,
  mapApiCourseToCourse,
} from '../../shared/mappers/courseMapper'
import { useModal } from '../../shared/ui/ModalContext'

import styles from './style.module.css'

export function CoursePage() {
  const { courseId } = useParams()
  const { status, user, token, refreshUser } = useAuth()
  const { openAuthModal } = useModal()

  const [course, setCourse] = useState<ApiCourse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return

    let cancelled = false
    setLoading(true)
    setError(null)

    void fetchCourse(courseId, token)
      .then((courseData) => {
        if (cancelled) return
        setCourse(courseData)
      })
      .catch(() => {
        if (cancelled) return
        setError('Не удалось загрузить курс')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [courseId, token])

  if (!courseId) {
    return (
      <CourseNotFoundState message="Возможно, ссылка устарела. Вернитесь к списку курсов." />
    )
  }

  const mapped = course ? mapApiCourseToCourse(course) : null
  const isOwned =
    !!user &&
    !!course &&
    Array.isArray(user.selectedCourses) &&
    user.selectedCourses.includes(course._id)

  const handleAddCourse = async () => {
    setAddError(null)

    if (status !== 'authenticated' || !token) {
      openAuthModal(courseId)
      return
    }

    if (!course) return

    try {
      setAdding(true)
      await addCourseForUser(course._id, token)
      await refreshUser()
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('Курс уже был добавлен')) {
        await refreshUser()
      } else {
        setAddError('Не удалось добавить курс. Попробуйте позже.')
      }
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingBlock} />
        <div className={styles.loadingBlock} />
      </div>
    )
  }

  if (error || !course || !mapped) {
    return (
      <CourseNotFoundState
        message={error ?? 'Возможно, ссылка устарела. Вернитесь к списку курсов.'}
      />
    )
  }

  const fittingCards = mapped.fitting.slice(0, 3)
  const ctaBullets = mapped.fitting.slice(3)
  const bannerColor = getCourseBannerColor(mapped.title)
  const compactTabletFittingText =
    mapped.title.toLowerCase() === 'бодифлекс' || mapped.title.toLowerCase() === 'фитнес'

  return (
    <div className={styles.page}>
      <section className={styles.bannerSection}>
        <div className={cn(styles.bannerCard, bannerColor)}>
          <h1 className={styles.bannerTitle}>{mapped.title}</h1>
          <img
            key={`${mapped.title}-card`}
            src={getCourseCardImagePath(mapped.title)}
            alt={mapped.title}
            className={cn('sm:hidden', styles.mobileCardImage)}
          />
          <img
            key={`${mapped.title}-banner`}
            src={getCourseBannerImagePath(mapped.title)}
            alt={mapped.title}
            className={cn('hidden sm:block', styles.desktopBannerImage)}
          />
        </div>
      </section>

      <FittingSection
        items={fittingCards}
        compactTabletText={compactTabletFittingText}
      />

      <div className={styles.ctaBlock}>
        <DirectionsSection directions={mapped.directions} />
        <div className={styles.ctaRunnerScope}>
          <CourseCtaSection
            ctaBullets={ctaBullets}
            description={mapped.description}
            isOwned={isOwned}
            isAuthenticated={status === 'authenticated'}
            adding={adding}
            addError={addError}
            onAddCourse={handleAddCourse}
            onRequireAuth={() => openAuthModal(courseId)}
          />

          <div className={styles.runnerWrap}>
            <GreenStripeLayer courseTitle={mapped.title} />
            <CtaRunnerImage />
          </div>
        </div>
      </div>
    </div>
  )
}
