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
    <div className="space-y-6 sm:space-y-10">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <h1 className="max-w-[947px] text-2xl font-medium leading-tight text-black sm:text-[40px] sm:leading-none lg:text-[60px]">
          Начните заниматься спортом
          <br className="hidden sm:block" />и улучшите качество жизни
        </h1>
        <div className="w-full shrink-0 rounded-md bg-[#BCEC30] px-4 py-3 sm:w-auto sm:px-5 sm:py-4">
          <p className="text-xl font-normal leading-tight text-[#202020] sm:text-[24px] lg:text-[32px]">
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

      <section className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {courses
          ? courses.map((course) => (
              <CourseCard key={course._id} course={mapApiCourseToCourse(course)} />
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-52 animate-pulse rounded-[30px] border border-[#D9D9D9] bg-[#f7f7f7]"
              />
            ))}
      </section>
    </div>
  )
}
