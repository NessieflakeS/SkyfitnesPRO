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
        'fixed bottom-4 left-4 right-4 z-50 rounded-[46px] bg-[#BCEC30] px-4 py-3 text-base font-normal text-black shadow-lg transition-all hover:bg-[#99D100] sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:px-6 sm:py-4 sm:text-[18px]',
        visible
          ? 'translate-y-0 opacity-100 sm:translate-x-[-50%]'
          : 'pointer-events-none translate-y-2 opacity-0',
      )}
      aria-label="Наверх"
      title="Наверх"
    >
      Наверх ↑
    </button>
  )
}
