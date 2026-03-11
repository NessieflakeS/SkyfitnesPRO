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
        'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[46px] bg-[#BCEC30] px-5 py-3.5 text-[18px] font-normal text-black shadow-lg transition-all hover:bg-[#99D100]',
        visible
          ? 'translate-y-0 translate-x-[-50%] opacity-100'
          : 'pointer-events-none translate-y-2 -translate-x-1/2 opacity-0',
      )}
      aria-label="Наверх"
      title="Наверх"
    >
      Наверх ↑
    </button>
  )
}
