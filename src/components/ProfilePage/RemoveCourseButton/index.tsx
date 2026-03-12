import { useState } from 'react'

import styles from './style.module.css'

const IconMinus = ({ className }: { className?: string }) => (
  <svg
    className={className ?? styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

type Props = {
  courseId: string
  disabled: boolean
  onRemove: (id: string) => void
}

export function RemoveCourseButton({ courseId, disabled, onRemove }: Props) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onRemove(courseId)
        }}
        disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={styles.button}
        title="Удалить курс"
        aria-label="Удалить курс"
      >
        <IconMinus />
      </button>
      {showTooltip && (
        <span className={styles.tooltip} role="tooltip">
          Удалить курс
        </span>
      )}
    </div>
  )
}
