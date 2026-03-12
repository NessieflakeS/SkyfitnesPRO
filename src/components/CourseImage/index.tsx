import { useEffect, useState } from 'react'

import { cn } from '../../shared/lib/cn'

import styles from './style.module.css'

type Props = {
  src: string
  alt: string
  fallbackClassName: string
  className?: string
  objectPosition?: string
}

export function CourseImage({
  src,
  alt,
  fallbackClassName,
  className,
  objectPosition = 'center',
}: Props) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  return (
    <div className={cn(styles.root, className)}>
      <div className={cn(styles.fallback, fallbackClassName)} aria-hidden />
      {!failed && (
        <img
          src={src}
          alt={alt}
          className={styles.image}
          style={{ objectPosition }}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
