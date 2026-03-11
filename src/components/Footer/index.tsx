export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} SkyFitnessPro</div>
          <div className="text-xs">Этап 1: статическая вёрстка (без API)</div>
        </div>
      </div>
    </footer>
  )
}
