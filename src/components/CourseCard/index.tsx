import { Link } from 'react-router-dom'

import { getCourseLevelLabel } from '../../shared/mock/courses'
import { Button } from '../Button'

import type { Course } from '../../shared/types/fitness'

type Props = {
  course: Course
}

export function CourseCard({ course }: Props) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div
        className={`h-28 bg-gradient-to-br ${course.coverColor} sm:h-32`}
        aria-hidden
      />
      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900">{course.title}</h3>
          <div className="text-xs text-slate-500">
            {getCourseLevelLabel(course.level)} • {course.durationDays} дней •{' '}
            {course.dailyMinutesFrom}-{course.dailyMinutesTo} мин/день
          </div>
        </div>

        <p className="line-clamp-3 text-sm text-slate-700">{course.description}</p>

        <div className="flex flex-wrap gap-2">
          {course.directions.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/courses/${course.id}`}
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 sm:w-auto"
          >
            Подробнее
          </Link>
          <Button variant="secondary" disabled className="w-full sm:w-auto">
            Добавить курс
          </Button>
        </div>
      </div>
    </article>
  )
}
