import { Outlet } from 'react-router-dom'

import { Footer } from '../Footer'
import { Header } from '../Header'
import { ScrollToTopButton } from '../ScrollToTopButton'

export function Layout() {
  return (
    <div className="min-h-dvh bg-[#fafafa] text-[#202020]">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}
