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
    'rounded-[46px] bg-[#BCEC30] px-4 py-3 text-base font-normal text-black hover:bg-[#99D100] sm:px-6 sm:py-4 sm:text-[18px]',
  secondary:
    'rounded-[46px] bg-[#f7f7f7] px-4 py-3 text-base font-normal text-[#202020] hover:bg-[#e5e5e5] sm:px-6 sm:py-4 sm:text-[18px]',
  ghost:
    'rounded-xl bg-transparent px-4 py-2 text-sm text-[#202020] hover:bg-[#f7f7f7]',
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
