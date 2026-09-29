'use client'

import { useRef } from 'react'
import { useMagnetic } from './useMagnetic'
import { onAnchorClick } from '@/lib/scroll'

type Props = {
  children: React.ReactNode
  href?: string
  variant?: 'solid' | 'ghost' | 'text'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  arrow?: boolean
  cursor?: string
}

/** Primary button: gold underline grows, label nudges, arrow advances, soft illumination, magnetic pull. */
export default function Button({
  children,
  href,
  variant = 'solid',
  className = '',
  type = 'button',
  disabled,
  onClick,
  arrow = true,
  cursor,
}: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  useMagnetic(ref)
  const cls = `btn ${variant === 'solid' ? 'btn-solid' : variant === 'ghost' ? 'btn-ghost' : 'px-0!'} ${className}`
  const inner = (
    <>
      <span className="btn-label">{children}</span>
      {arrow && (
        <svg className="btn-arrow" width="22" height="10" viewBox="0 0 22 10" aria-hidden="true">
          <path d="M0 5h20M16 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      )}
      <span className="btn-line" aria-hidden="true" />
    </>
  )

  if (href) {
    const isHash = href.startsWith('#')
    return (
      <a
        ref={ref}
        href={href}
        className={cls}
        data-cursor={cursor}
        onClick={(e) => {
          if (isHash) onAnchorClick(e)
          onClick?.()
        }}
      >
        {inner}
      </a>
    )
  }
  return (
    <button ref={ref} type={type} className={cls} disabled={disabled} onClick={onClick} data-cursor={cursor}>
      {inner}
    </button>
  )
}
