'use client'

import { useRef, useState } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { markLoaded } from '@/lib/loader'
import { lockScroll } from '@/lib/scroll'

/** ~1.6s opening title card: gold line draws, name rises, curtain lifts into the hero. */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      lockScroll(true)
      window.scrollTo(0, 0)

      const finish = () => {
        lockScroll(false)
        markLoaded()
        setGone(true)
      }

      if (reduced) {
        gsap.to(root.current, { autoAlpha: 0, duration: 0.3, delay: 0.2, onComplete: finish })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.fromTo(q('.ld-line'), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power3.inOut' })
        .fromTo(q('.ld-name'), { yPercent: 110 }, { yPercent: 0, duration: 0.8 }, 0.3)
        .fromTo(q('.ld-sub'), { autoAlpha: 0, letterSpacing: '0.6em' }, { autoAlpha: 1, letterSpacing: '0.34em', duration: 0.8 }, 0.45)
        .fromTo(q('.ld-pillars span'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.6)
        .to(q('.ld-inner'), { autoAlpha: 0, y: -20, duration: 0.45, ease: 'power2.in' }, 1.25)
        .to(q('.ld-top'), { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, 1.35)
        .to(q('.ld-bottom'), { yPercent: 100, duration: 0.8, ease: 'expo.inOut' }, 1.35)
        .add(() => markLoaded(), 1.5)
        .add(finish)
    },
    { scope: root }
  )

  if (gone) return null

  return (
    <div ref={root} className="fixed inset-0 z-[150]" role="status" aria-label="Loading Ambrocio Construction & Remodeling">
      <div className="ld-top absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div className="ld-bottom absolute inset-x-0 bottom-0 h-1/2 bg-ink" />
      <div className="ld-inner absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div className="overflow-hidden">
          <p className="ld-name display text-[16vw] text-bone md:text-[7vw]">Ambrocio</p>
        </div>
        <div className="ld-line my-5 h-px w-[min(70vw,520px)] origin-left bg-gold" />
        <p className="ld-sub display-wide text-[3vw] text-bone/80 md:text-[0.95rem]">Construction &amp; Remodeling</p>
        <p className="ld-pillars mono-tag mt-6 flex gap-4 text-gold">
          <span>Build.</span>
          <span>Remodel.</span>
          <span>Improve.</span>
        </p>
      </div>
    </div>
  )
}
