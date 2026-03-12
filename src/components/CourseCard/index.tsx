import { useState } from 'react'
import { Link } from 'react-router-dom'

import { addCourseForUser } from '../../shared/api/courses'
import { useAuth } from '../../shared/auth/AuthContext'
import { getCourseCardImagePath } from '../../shared/config/courseImages'
import { getCourseLevelLabel } from '../../shared/mock/courses'
import { useModal } from '../../shared/ui/ModalContext'

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
  <svg
    className="size-[18px] shrink-0 text-[#202020]"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M2 20h4V10H2v10zm6 0h4V4H8v16zm6 0h4v-7h-4v7zm6 0h4V2h-4v18z" />
  </svg>
)

function AddCourseButton({ courseId }: { courseId: string }) {
  const { status, token, refreshUser } = useAuth()
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
      .then(() => refreshUser())
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : ''
        if (msg.includes('Курс уже был добавлен')) void refreshUser()
      })
      .finally(() => setAdding(false))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={adding}
      className="absolute right-2 top-2 z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-transparent"
      title="Добавить курс"
      aria-label="Добавить курс"
    >
      <img src="/Icon_plus.svg" alt="" className="size-full object-contain" aria-hidden />
    </button>
  )
}

type Props = {
  course: Course
}

export function CourseCard({ course }: Props) {
  return (
    <article className="relative flex h-[492px] w-full max-w-[343px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] transition-shadow hover:shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.18)] sm:rounded-[30px]">
      <Link to={`/courses/${course.id}`} className="flex min-h-0 flex-1 flex-col">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-t-2xl sm:rounded-t-[30px]">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${course.coverColor}`}
            aria-hidden
          />
          <img
            key={course.id}
            src={getCourseCardImagePath(course.title)}
            alt={course.title}
            className="absolute inset-0 h-full w-full rounded-t-2xl object-cover sm:rounded-t-[30px]"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <div className="shrink-0 px-4 pb-4 pt-4 sm:px-5 sm:pt-5">
          <h3 className="text-xl font-bold leading-tight text-black sm:text-2xl">
            {course.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-[50px] bg-[#f7f7f7] px-2 py-1.5 text-xs font-normal text-[#202020] sm:gap-2 sm:px-[10px] sm:py-2 sm:text-sm">
              <IconCalendar />
              {course.durationDays} дней
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[50px] bg-[#f7f7f7] px-2 py-1.5 text-xs font-normal text-[#202020] sm:gap-2 sm:px-[10px] sm:py-2 sm:text-sm">
              <IconClock />
              {course.dailyMinutesFrom}-{course.dailyMinutesTo} мин/день
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[50px] bg-[#f7f7f7] px-2 py-1.5 text-xs font-normal text-[#202020] sm:gap-2 sm:px-[10px] sm:py-2 sm:text-sm">
              <IconSignal />
              {getCourseLevelLabel(course.level)}
            </span>
          </div>
        </div>
      </Link>
      <AddCourseButton courseId={course.id} />
    </article>
  )
}
