import { useEffect, useState } from 'react'

import { CourseCard } from '../../components/CourseCard'
import { fetchCourses, type ApiCourse } from '../../shared/api/courses'
import { mapApiCourseToCourse } from '../../shared/mappers/courseMapper'

import styles from './style.module.css'

export function CoursesPage() {
  const [courses, setCourses] = useState<ApiCourse[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isLoading = courses === null && !error

  useEffect(() => {
    let cancelled = false
    fetchCourses()
      .then((data) => {
        if (!cancelled) {
          setCourses(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Не удалось загрузить курсы. Попробуйте обновить страницу.')
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroLineNoWrap}>Начните заниматься спортом</span>
          <span className={styles.heroLine}>и улучшите качество жизни</span>
        </h1>
        <div className={styles.heroBadgeWrap}>
          <div className={styles.heroBadge}>
            <p className={styles.heroBadgeText}>
              Измени своё
              <br />
              тело за полгода!
            </p>
          </div>
          <div className={styles.heroBadgeArrow} aria-hidden />
        </div>
      </section>

      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.grid}>
        {courses
          ? courses.map((course) => (
              <CourseCard key={course._id} course={mapApiCourseToCourse(course)} />
            ))
          : isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={styles.skeleton} />
            ))}
      </section>
    </div>
  )
}
