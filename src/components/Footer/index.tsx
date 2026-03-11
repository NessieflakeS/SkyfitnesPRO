export function Footer() {
  return (
    <footer className="border-t border-[#D9D9D9] bg-white">
      <div className="mx-auto w-full max-w-6xl px-3 py-6 text-center text-xs text-[#202020]/60 sm:px-6 sm:py-8 sm:text-sm lg:px-8">
        © {new Date().getFullYear()} SkyFitnessPro
      </div>
    </footer>
  )
}
