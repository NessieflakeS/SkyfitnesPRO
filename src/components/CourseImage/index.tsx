import { useEffect, useState } from 'react'

import { cn } from '../../shared/lib/cn'

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
    <div className={cn('relative overflow-hidden', className)}>
      <div className={cn('absolute inset-0', fallbackClassName)} aria-hidden />
      {!failed && (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition }}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
