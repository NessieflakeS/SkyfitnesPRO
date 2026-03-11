import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-[#D9D9D9] bg-white p-6 text-center shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:rounded-[30px] sm:p-8 md:p-12">
      <div className="text-5xl font-bold tracking-tight text-[#202020] sm:text-6xl">
        404
      </div>
      <div className="mt-2 text-sm font-semibold text-[#202020] sm:mt-3 sm:text-base">
        Страница не найдена
      </div>
      <p className="mt-2 text-xs text-[#202020]/70 sm:text-sm">
        Такой страницы нет. Вернитесь к списку курсов.
      </p>
      <div className="mt-5 sm:mt-6">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-[46px] bg-[#BCEC30] px-4 py-3 text-base font-normal text-black transition-colors hover:bg-[#99D100] sm:px-6 sm:py-4 sm:text-[18px]"
        >
          На главную
        </Link>
      </div>
    </div>
  )
}
