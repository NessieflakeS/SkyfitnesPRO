import { useEffect, useMemo, useState } from 'react'

import { cn } from '../../shared/lib/cn'

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  const scrollThreshold = useMemo(() => 600, [])

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > scrollThreshold)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollThreshold])

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-50 grid size-12 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-lg transition-all',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0',
      )}
      aria-label="Наверх"
      title="Наверх"
    >
      ↑
    </button>
  )
}
