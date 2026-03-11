import { useId, useState } from 'react'
import { Link } from 'react-router-dom'

import { addCourseForUser } from '../../shared/api/courses'
import { useAuth } from '../../shared/auth/AuthContext'
import { useModal } from '../../shared/ui/ModalContext'
import { getCourseLevelLabel } from '../../shared/mock/courses'

import type { Course } from '../../shared/types/fitness'

const IconCalendar = () => (
  <svg
    className="size-[18px] shrink-0 text-[#202020]"
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
    className="size-[18px] shrink-0 text-[#202020]"
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
  <svg className="size-[18px] shrink-0 text-[#202020]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 20h4V10H2v10zm6 0h4V4H8v16zm6 0h4v-7h-4v7zm6 0h4V2h-4v18z" />
  </svg>
)

function AddCourseButton({ courseId, maskId }: { courseId: string; maskId: string }) {
  const { status, token } = useAuth()
  const { openAuthModal } = useModal()
  const [adding, setAdding] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (status !== 'authenticated' || !token) {
      openAuthModal(courseId)
      return
    }
    setAdding(true)
    addCourseForUser(courseId, token)
      .catch(() => {})
      .finally(() => setAdding(false))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={adding}
      className="absolute right-2 top-2 z-10 flex size-6 shrink-0 items-center justify-center rounded-full sm:right-3 sm:top-3 sm:size-7"
      title="Добавить курс"
      aria-label="Добавить курс"
    >
      <svg
        className="size-full"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <defs>
          <mask id={maskId}>
            <circle cx="12" cy="12" r="12" fill="white" />
            <path
              d="M11 5h2v14h-2zM5 11h14v2H5z"
              fill="black"
            />
          </mask>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="12"
          fill="#BCEC30"
          mask={`url(#${maskId})`}
        />
      </svg>
    </button>
  )
}

type Props = {
  course: Course
}

export function CourseCard({ course }: Props) {
  const maskId = useId().replace(/:/g, '-')

  return (
    <article className="relative overflow-hidden rounded-2xl bg-white pb-[15px] shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] transition-shadow hover:shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.18)] sm:rounded-[30px]">
      <Link
        to={`/courses/${course.id}`}
        className="block"
      >
        <div className="relative h-36 sm:h-44 md:h-52 lg:h-[260px]">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${course.coverColor}`}
            aria-hidden
          />
        </div>
        <div className="flex flex-col gap-2 px-4 pt-4 sm:gap-2 sm:px-5 sm:pt-5 md:px-6 lg:px-[30px] lg:pt-5">
          <h3 className="text-xl font-medium leading-[1.1] text-black sm:text-2xl md:text-[32px]">
            {course.title}
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-[50px] bg-[#f7f7f7] px-2 py-1.5 text-xs font-normal text-[#202020] sm:gap-2 sm:px-[10px] sm:py-2.5 sm:text-[16px]">
              <IconCalendar />
              {course.durationDays} дней
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[50px] bg-[#f7f7f7] px-2 py-1.5 text-xs font-normal text-[#202020] sm:gap-2 sm:px-[10px] sm:py-2.5 sm:text-[16px]">
              <IconClock />
              {course.dailyMinutesFrom}-{course.dailyMinutesTo} мин/день
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[50px] bg-[#f7f7f7] px-2 py-1.5 text-xs font-normal text-[#202020] sm:gap-2 sm:px-[10px] sm:py-2.5 sm:text-[16px]">
              <IconSignal />
              {getCourseLevelLabel(course.level)}
            </span>
          </div>
        </div>
      </Link>
      <AddCourseButton courseId={course.id} maskId={maskId} />
    </article>
  )
}
