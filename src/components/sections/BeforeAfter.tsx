'use client'

import { useCallback, useRef, useState } from 'react'
import { gsap, useGSAP, MQ } from '@/lib/gsap'
import Room from '@/components/svg/Room'
import Reveal from '@/components/ui/Reveal'

const STEPS = ['Demo', 'Paint', 'Flooring', 'Cabinets', 'Trim', 'Lighting'] as const

/** Drag / keyboard comparison of the same room before and after. */
function CompareSlider() {
  const [pos, setPos] = useState(50)
  const box = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const setFromClient = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }, [])

  return (
    <div
      ref={box}
      className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden md:aspect-[16/9]"
      onPointerDown={(e) => {
        dragging.current = true
        ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
        setFromClient(e.clientX)
      }}
      onPointerMove={(e) => dragging.current && setFromClient(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      data-cursor="Drag"
    >
      <Room show="before" id="cmp-before" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <Room show="after" id="cmp-after" className="absolute inset-0 h-full w-full" />
      </div>
      <span className="mono-tag absolute left-4 top-4 bg-ink/85 px-3 py-2 text-bone">Before</span>
      <span className="mono-tag absolute right-4 top-4 bg-gold px-3 py-2 text-ink">After</span>
      <div className="absolute inset-y-0 w-px bg-gold" style={{ left: `${pos}%` }}>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare before and after: drag or use arrow keys"
          className="peer absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
        <span className="pointer-events-none absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold bg-ink/85 text-gold backdrop-blur peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-gold">
          <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true">
            <path d="M6 1L1 6l5 5M20 1l5 5-5 5M1 6h24" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </span>
      </div>
    </div>
  )
}

export default function BeforeAfter() {
  const root = useRef<HTMLElement>(null)
  const [step, setStep] = useState(-1)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add(MQ.reduced, () => {
        gsap.set(q('.ba-stage .ba-after'), { opacity: 1 })
        gsap.set(q('.ba-stage .a-wipe'), { attr: { width: 1600 } })
        gsap.set(q('.ba-stage .a-window, .ba-stage .a-tile, .ba-stage .a-door, .ba-stage .a-glow, .ba-stage .a-floor, .ba-stage .a-island'), { opacity: 1 })
        gsap.set(q('.ba-stage .ba-bulb'), { opacity: 0 })
        setStep(STEPS.length)
      })

      mm.add(MQ.motion, () => {
        const s = (sel: string) => q(`.ba-stage ${sel}`)
        gsap.set(s('.a-trim'), { drawSVG: '0%' })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: q('.ba-pin')[0],
            start: 'top top',
            end: '+=480%',
            pin: true,
            scrub: 1.4,
            anticipatePin: 1,
            onUpdate: (self) => {
              const t = self.progress * tl.duration()
              const idx = t < 0.4 ? -1 : t > 6.4 ? STEPS.length : Math.min(STEPS.length - 1, Math.floor(t - 0.4))
              setStep((prev) => (prev === idx ? prev : idx))
            },
          },
        })

        // flicker of the bare bulb as we arrive
        tl.to(s('.ba-bulb'), { opacity: 0.4, duration: 0.1, yoyo: true, repeat: 3 }, 0.1)

        // 01 demo: dust kicks up, old cabinets come down
        tl.to(s('.ba-dust'), { opacity: 1, duration: 0.3 }, 0.4)
          .to(s('.ba-dust circle'), { y: () => gsap.utils.random(-120, 40), x: () => gsap.utils.random(-60, 60), scale: 1.8, transformOrigin: '50% 50%', duration: 1, stagger: 0.01 }, 0.4)
          .to(s('.ba-oldcab'), { y: 60, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0.6)
          .to(s('.ba-debris'), { opacity: 0, duration: 0.4 }, 0.9)
          .to(s('.ba-dust'), { opacity: 0, duration: 0.5 }, 1.2)

        // 02 paint sweeps across
          .fromTo(s('.a-roller'), { attr: { x: 0 }, opacity: 1 }, { attr: { x: 1600 }, duration: 1, immediateRender: false }, 1.4)
          .fromTo(s('.a-wipe'), { attr: { width: 0 } }, { attr: { width: 1600 }, duration: 1 }, 1.4)
          .to(s('.a-roller'), { opacity: 0, duration: 0.1 }, 2.35)

        // 03 new floor slides in
          .fromTo(s('.a-floor'), { x: 1700, opacity: 1 }, { x: 0, opacity: 1, duration: 0.9, ease: 'power2.out' }, 2.4)

        // 04 cabinets morph into their finished form
          .fromTo(s('.a-door'), { opacity: 0, scaleY: 0.2, transformOrigin: '50% 100%' }, { opacity: 1, scaleY: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out' }, 3.4)
          .to(s('.a-tile'), { opacity: 1, duration: 0.25, stagger: { each: 0.004, from: 'start' } }, 3.6)
          .fromTo(s('.a-island'), { y: 320, opacity: 1 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 3.9)

        // 05 window trim
          .to(s('.a-window'), { opacity: 1, duration: 0.3 }, 4.4)
          .to(s('.a-trim'), { drawSVG: '100%', duration: 0.7 }, 4.5)

        // 06 lights on
          .fromTo(s('.a-pendant'), { y: -560 }, { y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, 5.4)
          .to(s('.ba-bulb'), { opacity: 0, duration: 0.2 }, 5.6)
          .to(s('.a-glow'), { opacity: 1, duration: 0.5, ease: 'power2.in' }, 5.9)
          .to(q('.ba-label-before'), { autoAlpha: 0, duration: 0.3 }, 6.1)
          .fromTo(q('.ba-label-after'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 6.2)
          .to({}, { duration: 0.6 })
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} aria-labelledby="ba-title" className="relative bg-ink">
      <div className="ba-pin relative h-svh overflow-hidden motion-reduce:h-auto">
        <div className="ba-stage absolute inset-0 motion-reduce:relative motion-reduce:aspect-[16/9]">
          <Room show="all" id="ba-main" className="h-full w-full" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(248,245,238,0.75)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink to-transparent" />

        <div className="absolute inset-x-0 top-[calc(var(--nav-h)+2svh)] px-5 md:px-10">
          <div className="mx-auto flex max-w-[1500px] items-start justify-between gap-6">
            <div>
              <p className="eyebrow text-gold">The Transformation</p>
              <h2 id="ba-title" className="display mt-3 grid text-[10vw] text-bone md:text-[4.6vw]">
                <span className="ba-label-before block [grid-area:1/1]">Before.</span>
                <span className="ba-label-after block text-gold opacity-0 [grid-area:1/1] motion-reduce:[grid-area:2/1] motion-reduce:opacity-100">After.</span>
              </h2>
            </div>
            <ol className="hidden gap-5 pt-2 md:flex" aria-label="Renovation steps">
              {STEPS.map((label, i) => (
                <li key={label} className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rotate-45 transition-colors duration-500"
                    style={{ background: i <= step ? '#8F6C2F' : 'rgba(43,38,32,0.2)' }}
                  />
                  <span className={`mono-tag transition-colors duration-500 ${i <= step ? 'text-bone' : 'text-bone/35'}`}>{label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-6 px-5 md:hidden" aria-hidden="true">
          <p className="mono-tag text-center text-gold">
            {step < 0 ? 'Scroll to renovate' : step >= STEPS.length ? 'Finished' : STEPS[step]}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal as="h3" by="words" className="display text-[9vw] text-bone md:text-[3.6vw]">
            See the difference.
          </Reveal>
          <p className="max-w-sm text-bone/60">
            Drag the handle to compare. This illustration shows the kind of change a remodel makes — photos of real
            Ambrocio projects can be added here.
          </p>
        </div>
        <CompareSlider />
      </div>
    </section>
  )
}
