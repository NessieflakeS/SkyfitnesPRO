import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../components/Button'
import { addCourseForUser, fetchCourse, type ApiCourse } from '../../shared/api/courses'
import { useAuth } from '../../shared/auth/AuthContext'
import { getCourseBannerImagePath } from '../../shared/config/courseImages'
import { getCourseBannerColor, mapApiCourseToCourse } from '../../shared/mappers/courseMapper'
import { useModal } from '../../shared/ui/ModalContext'

function CtaRunnerImage() {
  return (
    <div className="absolute -left-[36%] top-[2%] z-10 h-[120%] w-[120%]">
      <img
        src="/images/courses/cta/runner.png"
        alt=""
        className="h-full w-full object-contain object-right-bottom"
        aria-hidden
      />
      <img
        src="/images/courses/cta/Vector%206094.svg"
        alt=""
        className="absolute right-[35%] top-[22%] h-10 w-auto -rotate-[7deg] sm:h-11"
        aria-hidden
      />
    </div>
  )
}

export function CoursePage() {
  const { courseId } = useParams()
  useNavigate() // требуется в дереве компонентов (используется роутером)
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
    !!user && !!course && Array.isArray(user.selectedCourses) && user.selectedCourses.includes(course._id)

  const handleAddCourse = async () => {
    setAddError(null)

    if (status !== 'authenticated' || !token) {
      openAuthModal(courseId ?? undefined)
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
      <section className={`relative flex min-h-[200px] flex-col overflow-hidden rounded-2xl sm:min-h-[240px] sm:flex-row sm:rounded-[30px] ${bannerColor}`}>
        <h1 className="absolute left-4 top-4 z-10 text-[60px] font-bold leading-tight tracking-tight text-white sm:left-6 sm:top-6">
          {mapped.title}
        </h1>
        <div className="flex flex-1" />
        <div className="relative h-40 shrink-0 overflow-hidden sm:h-auto sm:w-80 sm:min-h-[240px]">
          <img
            key={mapped.title}
            src={getCourseBannerImagePath(mapped.title)}
            alt={mapped.title}
            className={`absolute inset-0 h-full w-full object-cover ${mapped.title.toLowerCase() === 'йога'
              ? 'object-[80%_0]'
              : mapped.title.toLowerCase() === 'бодифлекс'
                ? 'object-[72%_0]'
                : 'object-right-top'}`}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-[#202020] sm:text-lg">
          Подойдет для вас, если:
        </h2>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {fittingCards.map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl bg-[#2d2d2d] p-3 sm:rounded-[30px] sm:p-4"
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

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-[#202020] sm:text-lg">
          Направления
        </h2>
        <div className="rounded-2xl bg-[#BCEC30] px-4 py-5 sm:rounded-[30px] sm:px-6 sm:py-5">
          <div className="grid w-full grid-cols-1 gap-x-16 gap-y-9 sm:grid-cols-3 sm:gap-x-28 sm:gap-y-10">
            {mapped.directions.map((name) => (
              <div key={name} className="flex items-center justify-start gap-2">
                <img
                  src="/Icon_star.svg"
                  alt=""
                  className="h-4 w-4 shrink-0 object-contain sm:h-5 sm:w-5"
                  width={24}
                  height={24}
                />
                <span className="text-base font-medium text-[#202020] sm:text-lg">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-visible rounded-2xl border border-[#D9D9D9] bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:rounded-[30px]">
        <div className="flex flex-col sm:flex-row">
          <div className="flex min-w-0 flex-[2] flex-col justify-center gap-3 p-5 sm:gap-4 sm:p-6 md:p-8">
            <h2 className="text-[40px] font-bold leading-tight text-[#202020] sm:text-[44px]">
              Начните путь
              <br />
              к новому телу
            </h2>
            {ctaBullets.length > 0 ? (
              <ul className="list-disc space-y-1.5 pl-4 text-xs text-[#202020] sm:text-sm">
                {ctaBullets.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs leading-6 text-[#202020]/90 sm:text-sm">
                {mapped.description}
              </p>
            )}
            <div className="mt-1">
              {isOwned ? (
                <Button disabled>
                  Добавлен
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    status === 'authenticated'
                      ? void handleAddCourse()
                      : openAuthModal(courseId ?? undefined)
                  }
                  disabled={adding}
                >
                  {status === 'authenticated'
                    ? 'Добавить курс'
                    : 'Войдите, чтобы добавить курс'}
                </Button>
              )}
            </div>
            {addError && (
              <p className="text-xs text-rose-600">{addError}</p>
            )}
          </div>
          <div className="relative flex-[3] shrink-0 overflow-visible h-[260px] sm:h-[300px] md:h-[340px]">
            <div className="absolute inset-0 origin-bottom scale-[1.12] translate-y-6">
              <img
                src="/images/courses/cta/Vector%206084.svg"
                alt=""
                className="absolute -bottom-24 left-0 z-0 w-full max-w-[115%] object-contain object-left-bottom opacity-90"
                aria-hidden
              />
              <CtaRunnerImage />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
