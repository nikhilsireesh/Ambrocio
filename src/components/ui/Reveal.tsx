'use client'

import { useRef } from 'react'
import { gsap, SplitText, useGSAP, MQ } from '@/lib/gsap'

type Props = {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span'
  children: React.ReactNode
  className?: string
  /** chars = character stagger, words = word rise, lines = masked line reveal */
  by?: 'chars' | 'words' | 'lines'
  from?: 'below' | 'above' | 'left' | 'right'
  delay?: number
  start?: string
  id?: string
}

/** Masked headline reveal triggered on scroll. Readers and reduced-motion users get plain text. */
export default function Reveal({
  as: Tag = 'h2',
  children,
  className = '',
  by = 'lines',
  from = 'below',
  delay = 0,
  start = 'top 85%',
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const el = ref.current
        if (!el) return
        const split = SplitText.create(el, {
          type: by === 'chars' ? 'lines,chars' : by === 'words' ? 'lines,words' : 'lines',
          mask: 'lines',
          linesClass: 'split-line-mask',
        })
        const targets = by === 'chars' ? split.chars : by === 'words' ? split.words : split.lines
        const offset = {
          below: { yPercent: 110 },
          above: { yPercent: -110 },
          left: { xPercent: -30, opacity: 0 },
          right: { xPercent: 30, opacity: 0 },
        }[from]
        gsap.from(targets, {
          ...offset,
          duration: by === 'chars' ? 1.1 : 1.25,
          ease: 'expo.out',
          stagger: by === 'chars' ? 0.022 : by === 'words' ? 0.06 : 0.12,
          delay,
          scrollTrigger: { trigger: el, start, once: true },
        })
        return () => split.revert()
      })
    },
    { scope: ref }
  )

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} id={id}>
      {children}
    </Tag>
  )
}
