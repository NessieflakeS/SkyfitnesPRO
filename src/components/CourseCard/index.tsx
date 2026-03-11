import { Link } from 'react-router-dom'

import { getCourseLevelLabel } from '../../shared/mock/courses'
import { Button } from '../Button'

import type { Course } from '../../shared/types/fitness'

type Props = {
  course: Course
}

export function CourseCard({ course }: Props) {
  return (
    <article className="overflow-hidden rounded-[30px] bg-white pb-4 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] transition-shadow hover:shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.18)]">
      <div
        className={`h-48 bg-gradient-to-br sm:h-64 md:h-[325px] ${course.coverColor}`}
        aria-hidden
      />
      <div className="flex flex-col gap-5 px-[30px] pt-5">
        <h3 className="text-[32px] font-medium leading-tight text-black">
          {course.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f7f7f7] px-[10px] py-2.5 text-[16px] font-normal text-[#202020]">
            {course.durationDays} дней
          </span>
          <span className="rounded-full bg-[#f7f7f7] px-[10px] py-2.5 text-[16px] font-normal text-[#202020]">
            {course.dailyMinutesFrom}-{course.dailyMinutesTo} мин/день
          </span>
          <span className="rounded-full bg-[#f7f7f7] px-[10px] py-2.5 text-[16px] font-normal text-[#202020]">
            {getCourseLevelLabel(course.level)}
          </span>
        </div>

        <p className="line-clamp-3 text-sm text-[#202020]">{course.description}</p>

        <div className="flex flex-wrap gap-2">
          {course.directions.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#f7f7f7] px-3 py-1 text-xs font-medium text-[#202020]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center justify-center rounded-[46px] bg-[#BCEC30] px-6 py-4 text-[18px] font-normal text-black transition-colors hover:bg-[#99D100] sm:w-auto"
          >
            Подробнее
          </Link>
          <Button variant="secondary" disabled className="sm:w-auto">
            Добавить курс
          </Button>
        </div>
      </div>
    </article>
  )
}
