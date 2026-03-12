import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../components/Button'
import { addCourseForUser, fetchCourse, type ApiCourse } from '../../shared/api/courses'
import { useAuth } from '../../shared/auth/AuthContext'
import {
  getCourseBannerImagePath,
  getCourseCardImagePath,
} from '../../shared/config/courseImages'
import {
  getCourseBannerColor,
  mapApiCourseToCourse,
} from '../../shared/mappers/courseMapper'
import { useModal } from '../../shared/ui/ModalContext'

const STRIPE_LOWER_COURSES = ['стретчинг', 'фитнес', 'йога']

function GreenStripeLayer({ courseTitle = '' }: { courseTitle?: string }) {
  const lower = STRIPE_LOWER_COURSES.includes(courseTitle.toLowerCase().trim())
  const greenTop = lower ? '-top-[44%] sm:-top-[38%]' : '-top-[56%] sm:-top-[50%]'
  return (
    <div className="absolute right-0 top-1/2 z-0 h-1/2 w-[55%] min-w-[200px] pointer-events-none sm:top-0 sm:h-full sm:w-[50%]">
      <img
        src="/images/courses/cta/Vector%206084.svg"
        alt=""
        className={`absolute -left-[92%] h-[170%] w-[280%] max-w-none object-contain object-left-top opacity-95 sm:-left-[78%] sm:h-[180%] sm:w-[260%] ${greenTop}`}
        aria-hidden
      />
    </div>
  )
}

const RUNNER_LOWER_COURSES = ['стретчинг', 'фитнес', 'йога']

function CtaRunnerImage({ courseTitle = '' }: { courseTitle?: string }) {
  const key = courseTitle.toLowerCase().trim()
  const lowerInAdaptive = RUNNER_LOWER_COURSES.includes(key)
  const isStretching = key === 'стретчинг'
  const runnerTranslate = isStretching
    ? '-translate-y-[58%] sm:-translate-y-[52%]'
    : lowerInAdaptive
      ? '-translate-y-[50%] sm:-translate-y-[44%]'
      : '-translate-y-[72%] sm:-translate-y-[66%]'
  const blackStripeTop = isStretching
    ? '-top-[42%] sm:-top-[46%]'
    : lowerInAdaptive
      ? '-top-[38%] sm:-top-[42%]'
      : '-top-[48%] sm:-top-[52%]'

  return (
    <div className="absolute inset-0">
      <img
        src="/images/courses/cta/Vector%206094.svg"
        alt=""
        className={`absolute right-[70%] z-[1] h-8 w-auto -rotate-[22deg] opacity-90 sm:right-[62%] sm:h-10 ${blackStripeTop}`}
        aria-hidden
      />
      <img
        src="/images/courses/cta/runner.png"
        alt=""
        className={`absolute top-0 right-0 z-[2] h-full max-h-[580px] w-auto object-contain object-right-top sm:top-auto sm:bottom-0 sm:max-h-[840px] sm:object-right-bottom ${runnerTranslate}`}
        aria-hidden
      />
    </div>
  )
}

export function CoursePage() {
  const { courseId } = useParams()
  useNavigate()
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
      <div className="rounded-2xl border border-[#D9D9D9] bg-white p-4 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:rounded-[30px] sm:p-6">
        <h1 className="text-base font-semibold text-[#202020] sm:text-lg">
          Курс не найден
        </h1>
        <p className="mt-2 text-xs text-[#202020]/70 sm:text-sm">
          Возможно, ссылка устарела. Вернитесь к списку курсов.
        </p>
        <div className="mt-4 sm:mt-5">
          <Link
            className="inline-flex items-center rounded-[46px] bg-[#BCEC30] px-4 py-3 text-base font-normal text-black hover:bg-[#99D100] sm:px-6 sm:py-4 sm:text-[18px]"
            to="/"
          >
            Перейти к курсам
          </Link>
        </div>
      </div>
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
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-[30px] bg-[#f7f7f7]" />
        <div className="h-40 animate-pulse rounded-[30px] bg-[#f7f7f7]" />
      </div>
    )
  }

  if (error || !course || !mapped) {
    return (
      <div className="rounded-2xl border border-[#D9D9D9] bg-white p-4 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:rounded-[30px] sm:p-6">
        <h1 className="text-base font-semibold text-[#202020] sm:text-lg">
          Курс не найден
        </h1>
        <p className="mt-2 text-xs text-[#202020]/70 sm:text-sm">
          {error ?? 'Возможно, ссылка устарела. Вернитесь к списку курсов.'}
        </p>
        <div className="mt-4 sm:mt-5">
          <Link
            className="inline-flex items-center rounded-[46px] bg-[#BCEC30] px-4 py-3 text-base font-normal text-black hover:bg-[#99D100] sm:px-6 sm:py-4 sm:text-[18px]"
            to="/"
          >
            Перейти к курсам
          </Link>
        </div>
      </div>
    )
  }

  const fittingCards = mapped.fitting.slice(0, 3)
  const ctaBullets = mapped.fitting.slice(3)
  const bannerColor = getCourseBannerColor(mapped.title)

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="flex justify-center">
        <div
          className={`relative flex h-[389px] w-full max-w-[343px] items-center justify-center overflow-hidden rounded-2xl sm:rounded-[30px] ${bannerColor}`}
        >
          <h1 className="absolute left-4 top-4 z-10 hidden text-[60px] font-bold leading-tight tracking-tight text-white sm:left-6 sm:top-6 sm:block">
            {mapped.title}
          </h1>
          <img
            key={`${mapped.title}-card`}
            src={getCourseCardImagePath(mapped.title)}
            alt={mapped.title}
            className={`sm:hidden ${
              ['степ-аэробика', 'стретчинг', 'бодифлекс', 'фитнес'].includes(
                mapped.title.toLowerCase(),
              )
                ? 'absolute inset-0 h-full w-full object-cover object-top'
                : 'max-h-full max-w-full object-contain'
            }`}
          />
          <img
            key={`${mapped.title}-banner`}
            src={getCourseBannerImagePath(mapped.title)}
            alt={mapped.title}
            className="hidden max-h-full max-w-full object-contain sm:block"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-[#202020] sm:text-lg">
          Подойдет для вас, если:
        </h2>
        <div className="grid grid-cols-1 justify-items-center gap-3 sm:grid-cols-3 sm:gap-4">
          {fittingCards.map((text, i) => (
            <div
              key={i}
              className="flex h-[141px] w-full max-w-[343px] items-center gap-3 rounded-2xl bg-[#2d2d2d] p-3 sm:rounded-[30px] sm:p-4"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2d2d2d] text-lg font-bold text-[#BCEC30] sm:h-11 sm:w-11 sm:text-xl"
                aria-hidden
              >
                {i + 1}
              </span>
              <p className="min-w-0 text-base leading-snug text-white sm:text-lg">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="relative">
        <GreenStripeLayer courseTitle={mapped.title} />
        <section className="relative z-[2] space-y-4">
          <h2 className="text-base font-semibold text-[#202020] sm:text-lg">
            Направления
          </h2>
          <div className="h-[336px] w-full max-w-[343px] rounded-2xl bg-[#BCEC30] px-4 py-5 sm:rounded-[30px] sm:px-6 sm:py-5">
            <div className="grid h-full w-full grid-cols-1 grid-rows-auto gap-x-16 gap-y-6 content-start sm:grid-cols-3 sm:gap-x-28 sm:gap-y-6">
              {mapped.directions.map((name) => (
                <div key={name} className="flex items-center justify-start gap-2">
                  <img
                    src="/Icon_star.svg"
                    alt=""
                    className="h-4 w-4 shrink-0 object-contain sm:h-5 sm:w-5"
                    width={24}
                    height={24}
                    aria-hidden
                  />
                  <span className="text-base font-medium text-[#202020] sm:text-lg">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-[15] mt-[155px] overflow-visible rounded-2xl border border-[#D9D9D9] bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:rounded-[30px]">
          <div className="flex flex-col sm:flex-row">
            <div className="flex min-w-0 flex-[2] flex-col justify-center gap-3 p-5 sm:gap-4 sm:p-6 md:p-8">
              <h2 className="text-[40px] font-bold leading-tight text-[#202020] sm:text-[44px]">
                Начните путь
                <br />к новому телу
              </h2>
              {ctaBullets.length > 0 ? (
                <ul className="list-[disc] space-y-1.5 pl-4 text-xs text-[#202020] sm:text-sm [&_li]:marker:text-black">
                  {ctaBullets.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs leading-6 text-[#202020]/90 sm:text-sm">
                  {mapped.description}
                </p>
              )}
              <div className="mt-3">
                {isOwned ? (
                  <Button disabled fullWidth className="sm:w-auto">
                    Добавлен
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    className="sm:w-auto"
                    onClick={() =>
                      status === 'authenticated'
                        ? void handleAddCourse()
                        : openAuthModal(courseId)
                    }
                    disabled={adding}
                  >
                    {status === 'authenticated'
                      ? 'Добавить курс'
                      : 'Войдите, чтобы добавить курс'}
                  </Button>
                )}
              </div>
              {addError && <p className="text-xs text-rose-600">{addError}</p>}
            </div>
            <div
              className="relative min-h-[260px] shrink-0 flex-[3] overflow-visible sm:min-h-[300px] md:min-h-[340px]"
              aria-hidden
            />
          </div>
        </section>

        <div className="pointer-events-none absolute right-0 top-1/2 z-10 h-1/2 w-[55%] min-w-[200px] sm:top-0 sm:h-full sm:w-[50%]">
          <CtaRunnerImage courseTitle={mapped.title} />
        </div>
      </div>
    </div>
  )
}
