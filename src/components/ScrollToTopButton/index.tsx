import { useEffect, useMemo, useState } from 'react'

import { cn } from '../../shared/lib/cn'

import styles from './style.module.css'

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
      className={cn(styles.button, visible ? styles.visible : styles.hidden)}
      aria-label="Наверх"
      title="Наверх"
    >
      Наверх ↑
    </button>
  )
}
