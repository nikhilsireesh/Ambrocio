'use client'

import { useRef, useState } from 'react'
import { gsap, useGSAP, MQ } from '@/lib/gsap'
import IsoBuilding from '@/components/svg/IsoBuilding'

// Storytelling framework for the page — not a contractual process.
const stages = [
  {
    n: '01',
    title: 'Vision',
    state: 'Empty land',
    text: 'Every project starts as an idea — a kitchen that works harder, a home that fits your life, a space ready for business.',
  },
  {
    n: '02',
    title: 'Planning',
    state: 'Layout & foundation',
    text: 'The idea takes shape: the scope, the layout and the details that matter are worked out before the first cut.',
  },
  {
    n: '03',
    title: 'Build',
    state: 'Framing',
    text: 'Structure goes up. Framing and the work that holds everything together, done square and solid.',
  },
  {
    n: '04',
    title: 'Transform',
    state: 'Walls, windows & roof',
    text: 'The space changes character — walls close in, openings take shape, the roof goes on.',
  },
  {
    n: '05',
    title: 'Finish',
    state: 'Finished property',
    text: 'The details come together. Light, trim and finishes turn construction into a place to live, work and last.',
  },
] as const

export default function Process() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add(MQ.reduced, () => {
        gsap.set(q('.iso-frame-clip, .iso-wall-clip'), { attr: { y: -400 } })
        gsap.set(q('.iso-frame'), { opacity: 0 })
        gsap.set(q('.iso-glow, .iso-halo'), { opacity: 1 })
        setActive(4)
      })

      mm.add(
        { desktop: MQ.desktop, mobile: MQ.mobile },
        (ctx) => {
          const { mobile } = ctx.conditions as { desktop: boolean; mobile: boolean }
          gsap.set(q('.iso-plan-line'), { drawSVG: '0%' })
          gsap.set(q('.iso-slab, .iso-roof, .iso-win, .iso-landscape'), { opacity: 0 })
          gsap.set(q('.iso-stakes'), { opacity: 0 })

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: mobile ? '+=400%' : '+=520%',
              pin: true,
              scrub: 1.4,
              anticipatePin: 1,
              onUpdate: (self) => {
                const idx = Math.min(4, Math.floor(self.progress * 5.2))
                setActive((prev) => (prev === idx ? prev : idx))
              },
            },
          })

          // subtle camera drift across the whole build
          tl.fromTo(q('.iso-camera'), { scale: 0.9, rotate: -2, yPercent: 4 }, { scale: 1.04, rotate: 0, yPercent: 0, duration: 5, ease: 'power1.inOut' }, 0)
          tl.fromTo(q('.proc-bg'), { opacity: 1 }, { opacity: 0.2, duration: 5 }, 0)

          // 01 vision – surveyed land
          tl.to(q('.iso-stakes'), { opacity: 1, duration: 0.4 }, 0.2)
          // 02 planning – layout lines, then slab
          tl.to(q('.iso-plan-line'), { drawSVG: '100%', duration: 0.6, stagger: 0.15 }, 1)
          tl.fromTo(q('.iso-slab'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 1.5)
          // 03 build – framing rises
          tl.to(q('.iso-frame-clip'), { attr: { y: -260 }, duration: 0.9, ease: 'power1.inOut' }, 2)
          tl.to(q('.iso-plan'), { opacity: 0, duration: 0.4 }, 2.2)
          // 04 transform – walls close in, windows, roof lands
          tl.to(q('.iso-wall-clip'), { attr: { y: -260 }, duration: 0.8, ease: 'power2.inOut' }, 3)
          tl.to(q('.iso-win'), { opacity: 1, duration: 0.3 }, 3.4)
          tl.fromTo(q('.iso-roof'), { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 3.5)
          tl.to(q('.iso-stakes'), { opacity: 0, duration: 0.3 }, 3.2)
          // 05 finish – light and landscape
          tl.to(q('.iso-glow'), { opacity: 1, duration: 0.4 }, 4.1)
          tl.to(q('.iso-halo'), { opacity: 1, duration: 0.6 }, 4.1)
          tl.to(q('.iso-landscape'), { opacity: 1, duration: 0.2 }, 4.2)
          tl.from(q('.iso-tree'), { scale: 0, transformOrigin: '50% 100%', duration: 0.5, stagger: 0.08, ease: 'back.out(1.6)' }, 4.2)
          tl.from(q('.iso-shrub'), { scale: 0, transformOrigin: '50% 100%', duration: 0.3, stagger: 0.04 }, 4.4)
          tl.to({}, { duration: 0.3 })
        }
      )
    },
    { scope: root }
  )

  return (
    <section
      id="process"
      ref={root}
      tabIndex={-1}
      aria-labelledby="process-title"
      className="relative overflow-hidden bg-ink outline-none motion-safe:h-svh"
    >
      <div className="proc-bg blueprint-grid pointer-events-none absolute inset-0" />

      <div className="iso-camera absolute inset-x-0 top-[calc(var(--nav-h)+11rem)] bottom-[38%] md:inset-y-0 md:left-[36%] md:right-0 md:top-0">
        <IsoBuilding className="h-full w-full" />
      </div>

      <div className="relative mx-auto grid h-full max-w-[1500px] grid-rows-[auto_1fr_auto] px-5 pb-8 pt-[calc(var(--nav-h)+2rem)] md:grid-cols-[minmax(0,34rem)_1fr] md:grid-rows-1 md:px-10 md:py-0">
        <div className="flex flex-col md:justify-center">
          <p className="eyebrow flex items-center gap-4 text-gold">
            <span className="h-px w-10 bg-gold" /> The Story of Every Space
          </p>
          <h2 id="process-title" className="display mt-4 text-[11vw] text-bone md:text-[4.4vw]">
            From vision <span className="cine block normal-case tracking-normal text-gold">to completion.</span>
          </h2>

          {/* stage copy (desktop) */}
          <div className="relative mt-12 hidden min-h-[15rem] md:block">
            {stages.map((s, i) => (
              <div
                key={s.n}
                className="absolute inset-0 transition-all duration-700 ease-[var(--ease-build)] motion-reduce:static motion-reduce:mb-8"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: `translateY(${i === active ? 0 : i < active ? -24 : 24}px)`,
                }}
                aria-hidden={i !== active}
              >
                <p className="mono-tag text-gold">
                  Stage {s.n} · {s.state}
                </p>
                <h3 className="display mt-3 text-6xl text-bone">{s.title}</h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-bone/70">{s.text}</p>
              </div>
            ))}
          </div>

          <ol className="mt-10 hidden gap-2 md:flex">
            {stages.map((s, i) => (
              <li key={s.n} className="flex-1">
                <span className="block h-[2px] bg-bone/15">
                  <span
                    className="block h-full origin-left bg-gold transition-transform duration-700"
                    style={{ transform: `scaleX(${i <= active ? 1 : 0})` }}
                  />
                </span>
                <span className={`mono-tag mt-3 block transition-colors ${i === active ? 'text-bone' : 'text-bone/35'}`}>
                  {s.n} {s.title}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* mobile stage copy */}
        <div className="row-start-3 md:hidden">
          <p className="mono-tag text-gold">
            Stage {stages[active].n} / 05 · {stages[active].state}
          </p>
          <h3 className="display mt-2 text-[12vw] text-bone">{stages[active].title}</h3>
          <p className="mt-2 text-bone/70">{stages[active].text}</p>
          <div className="mt-4 flex gap-1.5">
            {stages.map((s, i) => (
              <span key={s.n} className="h-[2px] flex-1" style={{ background: i <= active ? '#8F6C2F' : 'rgba(43,38,32,.15)' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
