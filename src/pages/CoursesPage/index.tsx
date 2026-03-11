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
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:items-center sm:p-10">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Курсы тренировок
            </h1>
            <p className="text-sm leading-6 text-slate-600">
              Выберите курс, занимайтесь дома и отслеживайте прогресс.
            </p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 p-6 text-white sm:p-8">
            <div className="text-sm/6 opacity-90">Подборка недели</div>
            <div className="mt-2 text-xl font-semibold">Йога + Стретчинг</div>
            <div className="mt-2 text-sm/6 opacity-90">Для восстановления и гибкости</div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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