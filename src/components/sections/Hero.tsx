'use client'

import { useRef, useState } from 'react'
import { gsap, SplitText, useGSAP, MQ } from '@/lib/gsap'
import { onLoaded } from '@/lib/loader'
import HouseElevation from '@/components/svg/HouseElevation'
import Dust from '@/components/ui/Dust'
import Button from '@/components/ui/Button'

const PHASES = ['Blueprint', 'Foundation', 'Framing', 'Exterior', 'Interior', 'Finished Home'] as const

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState(-1)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      const finishedState = () => {
        gsap.set(q('.h-ghost, .h-grid, .h-dims, .h-outline, .h-frame'), { opacity: 0 })
        gsap.set(q('.h-sky, .h-found, .h-walls, .h-roof, .h-win, .h-glow, .h-interior, .h-land'), { opacity: 1 })
        gsap.set(q('.h-frame-clip, .h-wall-clip'), { attr: { y: 0 } })
      }

      mm.add(MQ.reduced, () => {
        finishedState()
        setPhase(5)
      })

      mm.add(
        { desktop: MQ.desktop, mobile: MQ.mobile },
        (ctx) => {
          const { mobile } = ctx.conditions as { desktop: boolean; mobile: boolean }

          // ---------- intro (after loader) ----------
          const title = SplitText.create(q('.hero-word'), { type: 'chars', mask: 'chars' })
          gsap.set(title.chars, { yPercent: 115 })
          gsap.set(q('.hero-fade'), { autoAlpha: 0, y: 24 })
          gsap.set(q('.hero-vision'), { autoAlpha: 0, xPercent: -12 })
          gsap.set(q('.hero-work'), { autoAlpha: 0, xPercent: 12 })
          gsap.set(q('.hero-rule'), { scaleX: 0, transformOrigin: 'left center' })
          gsap.set(q('.hero-horizon'), { scaleX: 0 })
          gsap.set(q('.h-ghost'), { opacity: 0 })

          const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
          intro
            .to(q('.hero-horizon'), { scaleX: 1, duration: 1.6, ease: 'power2.inOut' })
            .to(q('.h-ghost'), { opacity: 1, duration: 1.4 }, '-=0.9')
            .to(title.chars, { yPercent: 0, duration: 1.3, stagger: 0.045 }, '-=1.2')
            .to(q('.hero-rule'), { scaleX: 1, duration: 1.1 }, '-=0.9')
            .to(q('.hero-vision'), { autoAlpha: 1, xPercent: 0, duration: 1.2 }, '-=0.8')
            .to(q('.hero-work'), { autoAlpha: 1, xPercent: 0, duration: 1.2 }, '-=0.95')
            .to(q('.hero-fade'), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, '-=0.9')
          const off = onLoaded(() => intro.play())

          // ---------- scroll-driven build ----------
          gsap.set(q('.h-outline'), { drawSVG: '0%' })
          gsap.set(q('.h-footings'), { drawSVG: '0%' })
          gsap.set(q('.h-final-line'), { autoAlpha: 0, yPercent: 60 })

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: mobile ? '+=380%' : '+=560%',
              pin: true,
              scrub: mobile ? 1 : 1.4,
              anticipatePin: 1,
              onUpdate: (self) => {
                const idx = self.progress < 0.04 ? -1 : Math.min(5, Math.floor((self.progress * 7.2 - 0.3)))
                setPhase((prev) => (prev === idx ? prev : Math.max(-1, idx)))
              },
            },
          })

          // camera
          tl.fromTo(q('.hero-camera'), { scale: mobile ? 1.05 : 1.14, yPercent: 3 }, { scale: 1, yPercent: 0, duration: 6.4, ease: 'power1.inOut' }, 0)

          // copy leaves
          tl.to(q('.hero-copy'), { yPercent: -18, autoAlpha: 0, duration: 0.7, ease: 'power2.in' }, 0)
          tl.to(q('.hero-cue'), { autoAlpha: 0, duration: 0.3 }, 0)
          tl.fromTo(q('.hero-hud'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.2)

          // 01 blueprint
          tl.to(q('.h-grid'), { opacity: 1, duration: 0.6 }, 0.3)
          tl.to(q('.h-ghost'), { opacity: 0, duration: 0.6 }, 0.4)
          tl.to(q('.h-outline'), { drawSVG: '100%', duration: 1.1 }, 0.3)
          tl.to(q('.h-dims'), { opacity: 1, duration: 0.6 }, 0.8)

          // 02 foundation
          tl.fromTo(q('.h-found'), { opacity: 0, scaleY: 0, transformOrigin: '50% 0%' }, { opacity: 1, scaleY: 1, duration: 0.6 }, 1.4)
          tl.to(q('.h-footings'), { drawSVG: '100%', duration: 0.6 }, 1.7)

          // 03 framing – walls of studs rise from the slab
          tl.to(q('.h-frame'), { opacity: 1, duration: 0.1 }, 2.3)
          tl.to(q('.h-frame-clip'), { attr: { y: 170 }, duration: 1, ease: 'power1.inOut' }, 2.3)
          tl.to(q('.h-grid'), { opacity: 0.45, duration: 0.8 }, 2.4)

          // 04 exterior – cladding rises over the frame, roof lands
          tl.to(q('.h-walls'), { opacity: 1, duration: 0.1 }, 3.3)
          tl.to(q('.h-wall-clip'), { attr: { y: 170 }, duration: 0.9, ease: 'power2.inOut' }, 3.3)
          tl.fromTo(q('.h-roof'), { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 3.8)
          tl.to(q('.h-outline'), { opacity: 0.15, duration: 0.6 }, 3.6)
          tl.to(q('.hero-horizon'), { opacity: 0, duration: 0.6 }, 3.6)
          tl.to(q('.h-frame'), { opacity: 0, duration: 0.4 }, 4.2)
          tl.to(q('.h-dims'), { opacity: 0.25, duration: 0.6 }, 3.6)

          // 05 interior – glass, then light
          tl.to(q('.h-win'), { opacity: 1, duration: 0.3 }, 4.3)
          tl.to(q('.h-glow'), { opacity: 1, duration: 0.7, ease: 'power1.in' }, 4.55)
          tl.to(q('.h-interior'), { opacity: 1, duration: 0.5 }, 4.8)
          tl.to(q('.h-grid'), { opacity: 0.12, duration: 0.6 }, 4.4)

          // 06 finished home
          tl.to(q('.h-sky'), { opacity: 1, duration: 0.8 }, 5.3)
          tl.to(q('.h-land'), { opacity: 1, duration: 0.5 }, 5.3)
          tl.from(q('.h-tree'), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.7, stagger: 0.1, ease: 'power2.out' }, 5.35)
          tl.from(q('.h-shrub'), { scale: 0, transformOrigin: '50% 100%', duration: 0.4, stagger: 0.03, ease: 'back.out(2)' }, 5.4)
          tl.to(q('.h-grid, .h-outline, .h-dims'), { opacity: 0, duration: 0.5 }, 5.5)
          tl.to(q('.h-final-line'), { autoAlpha: 1, yPercent: 0, duration: 0.6, stagger: 0.18, ease: 'power3.out' }, 5.8)
          tl.to(q('.hero-vignette'), { opacity: 0.55, duration: 0.8 }, 5.6)
          tl.to({}, { duration: 0.6 }) // hold on the finished home

          return () => {
            off()
            title.revert()
          }
        }
      )
    },
    { scope: root }
  )

  return (
    <section
      id="home"
      ref={root}
      tabIndex={-1}
      aria-label="Ambrocio Construction & Remodeling"
      className="relative h-svh min-h-[560px] w-full overflow-hidden bg-ink outline-none"
    >
      {/* the build */}
      <div className="hero-camera absolute inset-0 will-change-transform">
        <HouseElevation className="absolute bottom-[9svh] left-1/2 aspect-[16/9] h-auto w-[128vw] -translate-x-1/2 md:bottom-0 md:left-0 md:h-full md:w-full md:translate-x-0 md:aspect-auto" />
      </div>

      <Dust className="opacity-70" />

      {/* atmosphere */}
      <div className="hero-vignette pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,transparent_35%,rgba(248,245,238,0.9)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42svh] bg-gradient-to-b from-ink via-ink/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[16svh] bg-gradient-to-t from-ink to-transparent" />

      {/* first blueprint line across the screen */}
      <div className="hero-horizon pointer-events-none absolute inset-x-0 top-[78%] h-px origin-left bg-gradient-to-r from-transparent via-gold/70 to-transparent md:top-[80%]" />

      {/* copy */}
      <div className="hero-copy relative z-10 mx-auto flex h-full max-w-[1500px] flex-col px-5 pt-[calc(var(--nav-h)+4svh)] md:px-10 md:pt-[calc(var(--nav-h)+7svh)]">
        <p className="hero-fade eyebrow mb-5 text-gold">General Construction · Residential & Commercial</p>
        <h1 className="display text-bone">
          <span className="hero-word block whitespace-nowrap text-[12.2vw] leading-[0.8] md:text-[12.5vw]">Ambrocio</span>
          <span className="sr-only"> </span>
          <span className="hero-fade display-wide mt-4 block text-[3.9vw] font-semibold tracking-[0.34em] text-bone/85 md:mt-5 md:text-[1.45vw]">
            Construction &amp; Remodeling
          </span>
        </h1>
        <div className="hero-rule mt-6 h-px w-40 bg-gold md:mt-8 md:w-72" />
        <p className="cine mt-5 text-[9vw] leading-[1] md:mt-6 md:text-[4.2vw]">
          <span className="hero-vision inline-block">Your Vision.</span>{' '}
          <span className="hero-work inline-block text-gold">Our Work.</span>
        </p>
        <div className="hero-fade mt-8 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-10 md:gap-5">
          <Button href="#contact" variant="solid">Get a Free Estimate</Button>
          <Button href="#work" variant="ghost">Explore Our Work</Button>
        </div>
      </div>

      {/* final line */}
      <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--nav-h)+5svh)] z-10 px-5 text-center motion-reduce:hidden md:top-[calc(var(--nav-h)+8svh)]">
        <p className="display text-[11vw] text-bone md:text-[6.4vw]" aria-hidden="true">
          <span className="block overflow-hidden"><span className="h-final-line block">Stronger Spaces.</span></span>
          <span className="block overflow-hidden"><span className="h-final-line cine block normal-case tracking-normal text-gold">Brighter Tomorrows.</span></span>
        </p>
      </div>

      {/* phase HUD */}
      <div className="hero-hud pointer-events-none absolute inset-x-0 bottom-5 z-10 flex items-end justify-between px-5 opacity-0 md:bottom-8 md:px-10" aria-hidden="true">
        <div>
          <p className="mono-tag text-gold">Phase {phase < 0 ? '00' : String(phase + 1).padStart(2, '0')} / 06</p>
          <p className="display-wide mt-1 text-sm text-bone md:text-base">{phase < 0 ? 'Empty Site' : PHASES[phase]}</p>
        </div>
        <ol className="flex gap-1.5" aria-hidden="true">
          {PHASES.map((p, i) => (
            <li
              key={p}
              className="h-[3px] w-6 transition-colors duration-500 md:w-12"
              style={{ background: i <= phase ? '#8F6C2F' : 'rgba(43,38,32,0.15)' }}
            />
          ))}
        </ol>
      </div>

      {/* scroll cue */}
      <div className="hero-cue pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 md:bottom-8" aria-hidden="true">
        <div className="hero-fade flex flex-col items-center gap-3">
          <span className="mono-tag text-bone/70">Scroll to build</span>
          <span className="relative block h-12 w-px overflow-hidden bg-bone/15">
            <span className="scroll-cue-line absolute inset-x-0 top-0 h-1/2 bg-gold" />
          </span>
        </div>
      </div>
    </section>
  )
}
