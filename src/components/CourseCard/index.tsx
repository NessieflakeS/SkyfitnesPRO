import { Link } from 'react-router-dom'

import { getCourseLevelLabel } from '../../shared/mock/courses'
import { Button } from '../Button'

import type { Course } from '../../shared/types/fitness'

type Props = {
  course: Course
}

export function CourseCard({ course }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white pb-4 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] transition-shadow hover:shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.18)] sm:rounded-[30px]">
      <div
        className={`h-40 bg-gradient-to-br sm:h-52 md:h-64 lg:h-[325px] ${course.coverColor}`}
        aria-hidden
      />
      <div className="flex flex-col gap-3 px-4 pt-4 sm:gap-4 sm:px-5 sm:pt-5 md:gap-5 md:px-6 md:pt-5 lg:px-[30px]">
        <h3 className="text-xl font-medium leading-tight text-black sm:text-2xl md:text-[32px]">
          {course.title}
        </h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <span className="rounded-full bg-[#f7f7f7] px-2 py-1.5 text-xs font-normal text-[#202020] sm:px-[10px] sm:py-2.5 sm:text-[16px]">
            {course.durationDays} дней
          </span>
          <span className="rounded-full bg-[#f7f7f7] px-2 py-1.5 text-xs font-normal text-[#202020] sm:px-[10px] sm:py-2.5 sm:text-[16px]">
            {course.dailyMinutesFrom}-{course.dailyMinutesTo} мин/день
          </span>
          <span className="rounded-full bg-[#f7f7f7] px-2 py-1.5 text-xs font-normal text-[#202020] sm:px-[10px] sm:py-2.5 sm:text-[16px]">
            {getCourseLevelLabel(course.level)}
          </span>
        </div>

        <p className="line-clamp-3 text-xs text-[#202020] sm:text-sm">
          {course.description}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {course.directions.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#f7f7f7] px-2.5 py-0.5 text-xs font-medium text-[#202020] sm:px-3 sm:py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <Link
            to={`/courses/${course.id}`}
            className="inline-flex w-full items-center justify-center rounded-[46px] bg-[#BCEC30] px-4 py-3 text-base font-normal text-black transition-colors hover:bg-[#99D100] sm:w-auto sm:px-6 sm:py-4 sm:text-[18px]"
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
