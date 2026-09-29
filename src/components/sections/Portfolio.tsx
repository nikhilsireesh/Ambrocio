'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, MQ } from '@/lib/gsap'
import { portfolio, type PortfolioSlot } from '@/content/media'
import Media from '@/components/ui/Media'
import DetailPlate from '@/components/svg/DetailPlates'
import Room from '@/components/svg/Room'
import HouseElevation from '@/components/svg/HouseElevation'
import { lockScroll } from '@/lib/scroll'

function Plate({ slot, variant }: { slot: PortfolioSlot; variant: string }) {
  const id = `${slot.id}-${variant}`
  if (slot.plate === 'kitchen') return <Room show="after" id={id} className="h-full w-full" />
  if (slot.plate === 'exterior') return <HouseElevation static="finished" id={id} className="h-full w-full" />
  return <DetailPlate kind={slot.plate} id={id} className="h-full w-full" />
}

const shapeCls: Record<PortfolioSlot['shape'], string> = {
  wide: 'w-[84vw] aspect-[16/10] md:w-[58vw] md:aspect-[16/9]',
  portrait: 'w-[70vw] aspect-[3/4] md:w-[27vw]',
  classic: 'w-[80vw] aspect-[4/3] md:w-[40vw]',
}
const offsetCls = ['md:self-end', 'md:self-start md:mt-[6svh]', 'md:self-center', 'md:self-end md:mb-[4svh]', 'md:self-start', 'md:self-center']

function Lightbox({ index, onClose, onNav }: { index: number; onClose: () => void; onNav: (d: number) => void }) {
  const slot = portfolio[index]
  const ref = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    lockScroll(true)
    const prev = document.activeElement as HTMLElement | null
    closeBtn.current?.focus()
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('button, a')
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault()
          f[f.length - 1].focus()
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault()
          f[0].focus()
        }
      }
    }
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      lockScroll(false)
      prev?.focus()
    }
  }, [onClose, onNav])

  useGSAP(
    () => {
      if (window.matchMedia(MQ.reduced).matches) return
      gsap.fromTo(ref.current, { clipPath: 'inset(50% 0 50% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: 0.8, ease: 'expo.inOut' })
      gsap.fromTo('.lb-media', { scale: 1.15 }, { scale: 1, duration: 1.4, ease: 'expo.out' })
      gsap.fromTo('.lb-info > *', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.06, delay: 0.35, duration: 0.8 })
    },
    { dependencies: [index], scope: ref }
  )

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`${slot.project ?? 'Project'} — ${slot.category}`}
      className="fixed inset-0 z-[120] flex flex-col bg-ink md:flex-row"
    >
      <div className="relative flex-1 overflow-hidden">
        <Media photo={slot.photo} sizes="100vw" className="lb-media absolute inset-0">
          <Plate slot={slot} variant="lb" />
        </Media>
        {!slot.photo.src && (
          <span className="mono-tag absolute left-5 top-5 border border-gold/60 bg-ink/80 px-3 py-2 text-gold">
            Placeholder — real project photo to be added
          </span>
        )}
      </div>
      <aside className="lb-info relative flex w-full flex-col gap-5 border-t border-gold/20 p-6 md:w-[26rem] md:justify-end md:border-l md:border-t-0 md:p-10">
        <p className="mono-tag text-gold">
          Project {String(index + 1).padStart(2, '0')} / {String(portfolio.length).padStart(2, '0')}
        </p>
        <div>
          <p className="mono-tag text-bone/50">Project</p>
          <p className="display mt-1 text-3xl text-bone">{slot.project ?? 'To be added'}</p>
        </div>
        <div>
          <p className="mono-tag text-bone/50">Category</p>
          <p className="display-wide mt-1 text-lg text-bone">{slot.category}</p>
        </div>
        {slot.location && (
          <div>
            <p className="mono-tag text-bone/50">Location</p>
            <p className="display-wide mt-1 text-lg text-bone">{slot.location}</p>
          </div>
        )}
        <div className="mt-2 flex items-center gap-3">
          <button type="button" onClick={() => onNav(-1)} className="mono-tag border border-bone/20 px-4 py-3 text-bone hover:border-gold hover:text-gold" aria-label="Previous project">
            ← Prev
          </button>
          <button type="button" onClick={() => onNav(1)} className="mono-tag border border-bone/20 px-4 py-3 text-bone hover:border-gold hover:text-gold" aria-label="Next project">
            Next →
          </button>
        </div>
      </aside>
      <button
        ref={closeBtn}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 grid h-12 w-12 place-items-center border border-bone/25 bg-ink/70 text-bone hover:border-gold hover:text-gold"
        aria-label="Close project view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
    </div>
  )
}

export default function Portfolio() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MQ.desktop, () => {
        const el = track.current!
        const distance = () => el.scrollWidth - window.innerWidth
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: q('.pf-pin')[0],
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1.2,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
        // images drift inside their frames at different speeds
        q('.pf-media').forEach((m, i) => {
          gsap.fromTo(
            m,
            { xPercent: -6 - (i % 3) * 2 },
            {
              xPercent: 6 + (i % 3) * 2,
              ease: 'none',
              scrollTrigger: { trigger: m.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
            }
          )
        })
        gsap.to(q('.pf-title'), {
          xPercent: -25,
          ease: 'none',
          scrollTrigger: { trigger: q('.pf-pin')[0], start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })
      })
    },
    { scope: root }
  )

  const nav = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + portfolio.length) % portfolio.length)), [])
  const close = useCallback(() => setOpen(null), [])

  return (
    <section id="work" ref={root} tabIndex={-1} aria-labelledby="work-title" className="relative bg-coal outline-none">
      <div className="pf-pin relative overflow-hidden md:h-svh">
        <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--nav-h)+2rem)] z-0 hidden md:block">
          <p className="pf-title display whitespace-nowrap pl-10 text-[17vw] text-bone/[0.05]" aria-hidden="true">
            Built to be seen. Built to be seen.
          </p>
        </div>

        <div className="relative z-10 px-5 pt-24 md:absolute md:left-10 md:top-[calc(var(--nav-h)+3rem)] md:px-0 md:pt-0">
          <p className="eyebrow flex items-center gap-4 text-gold">
            <span className="h-px w-10 bg-gold" /> Our Work
          </p>
          <h2 id="work-title" className="display mt-4 text-[13vw] text-bone md:text-[5vw]">
            Built to <span className="cine normal-case tracking-normal text-gold">be seen.</span>
          </h2>
        </div>

        <div
          ref={track}
          className="relative z-10 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-16 [scrollbar-width:none] md:mt-0 md:h-full md:items-center md:gap-[5vw] md:pb-0 md:motion-safe:snap-none md:motion-safe:overflow-visible md:pl-[46vw] md:pr-[10vw] md:pt-[calc(var(--nav-h)+6rem)]"
        >
          {portfolio.map((slot, i) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setOpen(i)}
              data-cursor="View project"
              aria-label={`Open ${slot.project ?? 'project'} — ${slot.category}${slot.photo.src ? '' : ' (placeholder)'}`}
              className={`group relative shrink-0 snap-center text-left ${shapeCls[slot.shape]} ${offsetCls[i % offsetCls.length]}`}
            >
              <div className="relative h-full w-full overflow-hidden">
                <Media photo={slot.photo} sizes="(min-width: 768px) 60vw, 85vw" className="pf-media absolute -inset-x-[8%] inset-y-0 transition-transform duration-[1.4s] ease-[var(--ease-build)] group-hover:scale-[1.06]">
                  <Plate slot={slot} variant="card" />
                </Media>
                <div className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/70 group-focus-visible:bg-ink/70" />
                {/* gold lines draw around the frame */}
                <span className="absolute left-3 right-3 top-3 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 group-hover:scale-x-100" />
                <span className="absolute bottom-3 left-3 right-3 h-px origin-right scale-x-0 bg-gold transition-transform duration-700 group-hover:scale-x-100" />
                <span className="absolute bottom-3 left-3 top-3 w-px origin-bottom scale-y-0 bg-gold transition-transform delay-100 duration-700 group-hover:scale-y-100" />
                <span className="absolute bottom-3 right-3 top-3 w-px origin-top scale-y-0 bg-gold transition-transform delay-100 duration-700 group-hover:scale-y-100" />
                {!slot.photo.src && (
                  <span className="mono-tag absolute left-5 top-5 border border-gold/50 bg-ink/75 px-2.5 py-1.5 text-[0.6rem] text-gold">
                    Placeholder · add project photo
                  </span>
                )}
                <div className="absolute inset-x-6 bottom-6 translate-y-3 opacity-100 transition-all duration-700 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                  <p className="mono-tag text-gold">Project {String(i + 1).padStart(2, '0')}</p>
                  <p className="display mt-1 text-2xl text-bone md:text-3xl">{slot.project ?? slot.category}</p>
                  {slot.project && <p className="display-wide mt-1 text-xs text-bone/70">{slot.category}</p>}
                  {slot.location && <p className="display-wide mt-1 text-xs text-bone/70">{slot.location}</p>}
                </div>
              </div>
              <p className="mono-tag mt-3 flex justify-between text-bone/45">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span>{slot.category}</span>
              </p>
            </button>
          ))}
        </div>
      </div>

      {open !== null && <Lightbox index={open} onClose={close} onNav={nav} />}
    </section>
  )
}
