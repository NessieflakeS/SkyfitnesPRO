import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl rounded-[30px] border border-[#D9D9D9] bg-white p-8 text-center shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:p-12">
      <div className="text-6xl font-bold tracking-tight text-[#202020]">404</div>
      <div className="mt-3 text-base font-semibold text-[#202020]">
        Страница не найдена
      </div>
      <p className="mt-2 text-sm text-[#202020]/70">
        Такой страницы нет. Вернитесь к списку курсов.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-[46px] bg-[#BCEC30] px-6 py-4 text-[18px] font-normal text-black transition-colors hover:bg-[#99D100]"
        >
          На главную
        </Link>
      </div>
    </div>
  )
}
