'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, MQ } from '@/lib/gsap'
import { services, type Service } from '@/content/site'
import SectionDrawing, { zones } from '@/components/svg/SectionDrawing'
import Reveal from '@/components/ui/Reveal'
import { onAnchorClick } from '@/lib/scroll'

// Desktop stage: 1600 × 900, drawing placed at (300, 40).
const OX = 300
const OY = 40
const LEFT: Service['id'][] = ['framing', 'cornice', 'drywall', 'doors', 'kitchen', 'fence', 'general']
const RIGHT: Service['id'][] = ['bathroom', 'carpentry', 'decks', 'tile', 'demo', 'more']
const LEFT_Y = [110, 210, 310, 410, 510, 610, 710]
const RIGHT_Y = [170, 290, 410, 530, 650, 770]
const LX = 270
const RX = 1330

const byId = Object.fromEntries(services.map((s) => [s.id, s])) as Record<Service['id'], Service>
const num = (id: Service['id']) => String(services.findIndex((s) => s.id === id) + 1).padStart(2, '0')

function Readout({ service }: { service: Service }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current || window.matchMedia(MQ.reduced).matches) return
    gsap.fromTo(ref.current.children, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' })
  }, [service.id])
  return (
    <div ref={ref} aria-live="polite">
      <p className="mono-tag text-gold">
        Service {num(service.id)} / {String(services.length).padStart(2, '0')}
      </p>
      <h3 className="display mt-3 text-[2.6vw] text-bone">{service.name}</h3>
      <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-bone/70">{service.description}</p>
    </div>
  )
}

export default function Services() {
  const root = useRef<HTMLElement>(null)
  const [activeId, setActiveId] = useState<Service['id']>('general')
  const active = byId[activeId]

  // Draw the active zone's linework when it changes.
  useEffect(() => {
    if (!root.current || window.matchMedia(MQ.reduced).matches) return
    const els = root.current.querySelectorAll(`.zone-${active.zone} .zl, .leader-${activeId}`)
    gsap.fromTo(els, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, ease: 'power2.inOut' })
  }, [activeId, active.zone])

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from(q('.stage-draw .zl'), {
          drawSVG: '0%',
          duration: 1.6,
          stagger: 0.06,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: q('.stage')[0], start: 'top 75%', once: true },
        })
        gsap.from(q('.svc-label'), {
          autoAlpha: 0,
          x: (i, el: HTMLElement) => (el.dataset.side === 'left' ? -24 : 24),
          duration: 0.9,
          stagger: 0.05,
          scrollTrigger: { trigger: q('.stage')[0], start: 'top 70%', once: true },
        })
      })
      // Mobile / tablet: the item nearest the middle of the screen drives the sticky drawing.
      mm.add('(max-width: 1023px)', () => {
        q('.svc-item').forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 62%',
            end: 'bottom 62%',
            onToggle: (self) => self.isActive && setActiveId((el as HTMLElement).dataset.id as Service['id']),
          })
        })
      })
    },
    { scope: root }
  )

  const label = (id: Service['id'], y: number, side: 'left' | 'right') => {
    const s = byId[id]
    const on = id === activeId
    return (
      <button
        key={id}
        type="button"
        data-side={side}
        data-cursor="Explore"
        onMouseEnter={() => setActiveId(id)}
        onFocus={() => setActiveId(id)}
        onClick={() => setActiveId(id)}
        aria-pressed={on}
        className={`svc-label group absolute flex -translate-y-1/2 items-baseline gap-3 py-2 ${
          side === 'left' ? 'flex-row-reverse text-right' : 'text-left'
        }`}
        style={
          side === 'left'
            ? { right: `${((1600 - LX) / 1600) * 100}%`, top: `${(y / 900) * 100}%` }
            : { left: `${(RX / 1600) * 100}%`, top: `${(y / 900) * 100}%` }
        }
      >
        <span className={`mono-tag transition-colors ${on ? 'text-gold' : 'text-bone/40'}`}>{num(id)}</span>
        <span
          className={`display-wide text-[0.95vw] leading-tight transition-colors duration-300 ${
            on ? 'text-gold' : 'text-bone/70 group-hover:text-bone'
          }`}
        >
          {s.name}
        </span>
      </button>
    )
  }

  const leader = (id: Service['id'], y: number, side: 'left' | 'right') => {
    const [ax, ay] = zones[byId[id].zone].anchor
    const on = id === activeId
    const x0 = side === 'left' ? LX + 14 : RX - 14
    const tx = ax + OX
    const ty = ay + OY
    return (
      <g key={id}>
        <path
          className={`leader-${id}`}
          d={`M${x0} ${y}H${side === 'left' ? x0 + 30 : x0 - 30}L${tx} ${ty}`}
          fill="none"
          stroke={on ? '#8F6C2F' : '#2B2620'}
          strokeOpacity={on ? 0.9 : 0.12}
          strokeWidth="1"
          style={{ transition: 'stroke-opacity .4s ease' }}
        />
        <circle cx={tx} cy={ty} r={on ? 5 : 2.5} fill={on ? '#8F6C2F' : '#2B2620'} fillOpacity={on ? 1 : 0.3} style={{ transition: 'all .4s ease' }} />
        {on && <circle cx={tx} cy={ty} r="14" fill="none" stroke="#8F6C2F" strokeOpacity="0.5" />}
      </g>
    )
  }

  return (
    <section id="services" ref={root} tabIndex={-1} className="blueprint-grid relative bg-coal py-24 outline-none md:py-32">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-6 flex items-center gap-4 text-gold">
              <span className="h-px w-10 bg-gold" /> Services
            </p>
            <Reveal as="h2" by="chars" className="display text-[14vw] text-bone md:text-[7vw]">
              Every trade.
            </Reveal>
            <Reveal as="p" by="words" delay={0.1} className="cine text-[9vw] text-gold md:text-[4vw]">
              One standard.
            </Reveal>
          </div>
          <p className="max-w-sm text-bone/65 md:pb-4">
            General construction for residential and commercial spaces — from structure to the final trim.
            <span className="hidden lg:inline"> Hover a service to find it in the building.</span>
          </p>
        </div>

        {/* ---------- desktop: architectural service wall ---------- */}
        <div className="stage relative mt-16 hidden aspect-[16/9] w-full lg:block">
          <SectionDrawing active={active.zone} viewBox="0 0 1600 900" offset={[OX, OY]} className="stage-draw absolute inset-0 h-full w-full">
            {LEFT.map((id, i) => leader(id, LEFT_Y[i], 'left'))}
            {RIGHT.map((id, i) => leader(id, RIGHT_Y[i], 'right'))}
            <text x="1296" y="880" fill="#8F6C2F" fontFamily="monospace" fontSize="12" letterSpacing="2" opacity="0.6">
              BUILDING SECTION · S-301
            </text>
          </SectionDrawing>
          <div className="absolute inset-0">
            {LEFT.map((id, i) => label(id, LEFT_Y[i], 'left'))}
            {RIGHT.map((id, i) => label(id, RIGHT_Y[i], 'right'))}
          </div>
          <div className="absolute bottom-[4%] left-[27%] right-[27%] flex items-end justify-between gap-8 border-t border-gold/25 pt-5">
            <Readout service={active} />
            <a href="#contact" onClick={onAnchorClick} className="mono-tag shrink-0 pb-1 text-gold underline-offset-4 hover:underline">
              Ask about it →
            </a>
          </div>
        </div>

        {/* ---------- mobile / tablet: vertical sequence ---------- */}
        <div className="mt-12 lg:hidden">
          <div className="sticky top-[var(--nav-h)] z-10 -mx-5 border-y border-gold/15 bg-coal/95 px-5 py-3 backdrop-blur md:-mx-10 md:px-10">
            <SectionDrawing active={active.zone} className="mx-auto h-auto w-full max-w-xl" viewBox="0 60 1000 540" />
            <p className="mono-tag mt-1 text-center text-gold">{active.name}</p>
          </div>
          <ol className="mt-4">
            {services.map((s, i) => (
              <li
                key={s.id}
                data-id={s.id}
                className={`svc-item border-b border-bone/10 py-8 transition-opacity duration-500 ${s.id === activeId ? 'opacity-100' : 'opacity-45'}`}
              >
                <p className="mono-tag text-gold">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="display mt-2 text-[9vw] text-bone md:text-5xl">{s.name}</h3>
                <p className="mt-3 max-w-lg text-bone/70">{s.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
