import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="text-6xl font-bold tracking-tight text-slate-900">404</div>
      <div className="mt-3 text-base font-semibold text-slate-900">
        Страница не найдена
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Такой страницы нет. Вернитесь к списку курсов.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          На главную
        </Link>
      </div>
    </div>
  )
}
