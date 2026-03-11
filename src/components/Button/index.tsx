import { cn } from '../../shared/lib/cn'

import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    fullWidth?: boolean
  }
>

const variantClass: Record<Variant, string> = {
  primary:
    'bg-[#BCEC30] text-black hover:bg-[#99D100] rounded-[46px] px-6 py-4 text-[18px] font-normal',
  secondary:
    'bg-[#f7f7f7] text-[#202020] hover:bg-[#e5e5e5] rounded-[46px] px-6 py-4 text-[18px] font-normal',
  ghost: 'bg-transparent text-[#202020] hover:bg-[#f7f7f7] rounded-xl px-4 py-2 text-sm',
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  children,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-colors disabled:pointer-events-none disabled:opacity-50',
        variantClass[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
