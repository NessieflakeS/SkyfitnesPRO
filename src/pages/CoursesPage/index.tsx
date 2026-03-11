import { useEffect, useState } from 'react'

import { CourseCard } from '../../components/CourseCard'
import { fetchCourses, type ApiCourse } from '../../shared/api/courses'
import { mapApiCourseToCourse } from '../../shared/mappers/courseMapper'

export function CoursesPage() {
  const [courses, setCourses] = useState<ApiCourse[] | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    <div className="space-y-10">
      <section className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="max-w-[947px] text-[40px] font-medium leading-none text-black sm:text-[60px]">
          Начните заниматься спортом
          <br />и улучшите качество жизни
        </h1>
        <div className="shrink-0 rounded-md bg-[#BCEC30] px-5 py-4">
          <p className="text-[24px] font-normal leading-tight text-[#202020] sm:text-[32px]">
            Измени своё
            <br />
            тело за полгода!
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses
          ? courses.map((course) => (
              <CourseCard key={course._id} course={mapApiCourseToCourse(course)} />
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
              />
            ))}
      </section>
    </div>
  )
}
