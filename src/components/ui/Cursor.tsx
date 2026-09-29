'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

/**
 * Architectural crosshair cursor. Elements opt in to a label with data-cursor="View project" etc.
 * Only runs on fine pointers with motion allowed; touch and reduced-motion users keep the native cursor.
 */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled || !root.current) return
    const el = root.current
    document.documentElement.classList.add('has-cursor')
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' })
    let current = ''
    let hidden = true

    const move = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      if (hidden) {
        hidden = false
        gsap.set(el, { x: e.clientX, y: e.clientY })
        gsap.to(el, { autoAlpha: 1, duration: 0.3 })
      }
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor], a, button, input, textarea, select')
      let next = ''
      if (target) {
        if (target.matches('input, textarea, select')) next = '__hide'
        else next = target.dataset.cursor ?? '__link'
      }
      if (next !== current) {
        current = next
        setLabel(next)
      }
    }
    const leave = () => {
      hidden = true
      gsap.to(el, { autoAlpha: 0, duration: 0.2 })
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  const isText = label && label !== '__link' && label !== '__hide'
  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[300] opacity-0"
      style={{ visibility: 'hidden' }}
    >
      <div
        className="relative -translate-x-1/2 -translate-y-1/2 transition-[opacity] duration-300"
        style={{ opacity: label === '__hide' ? 0 : 1 }}
      >
        {/* crosshair */}
        <div
          className="relative grid place-items-center transition-all duration-500 ease-[var(--ease-build)]"
          style={{
            width: isText ? 112 : label === '__link' ? 44 : 26,
            height: isText ? 112 : label === '__link' ? 44 : 26,
          }}
        >
          <span
            className="absolute inset-0 rounded-full border transition-all duration-500"
            style={{
              borderColor: isText ? 'rgba(143,108,47,0.9)' : 'rgba(43,38,32,0.5)',
              background: isText ? 'rgba(248,245,238,0.85)' : 'transparent',
              backdropFilter: isText ? 'blur(6px)' : undefined,
            }}
          />
          {!isText && (
            <>
              <span className="absolute left-1/2 top-[-6px] h-[10px] w-px -translate-x-1/2 bg-gold" />
              <span className="absolute bottom-[-6px] left-1/2 h-[10px] w-px -translate-x-1/2 bg-gold" />
              <span className="absolute left-[-6px] top-1/2 h-px w-[10px] -translate-y-1/2 bg-gold" />
              <span className="absolute right-[-6px] top-1/2 h-px w-[10px] -translate-y-1/2 bg-gold" />
              <span className="h-[3px] w-[3px] rounded-full bg-gold" />
            </>
          )}
          {isText && (
            <span className="relative px-3 text-center font-display text-[0.62rem] font-bold uppercase leading-tight tracking-[0.2em] text-gold [font-stretch:115%]">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
