'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, MQ } from '@/lib/gsap'
import DetailPlate, { type PlateKind } from '@/components/svg/DetailPlates'

const plates: { kind: PlateKind; label: string; cls: string; speed: number }[] = [
  { kind: 'framing', label: 'Wood framing', cls: 'left-[3%] top-[4%] w-[44vw] aspect-[3/4] md:w-[24vw]', speed: -30 },
  { kind: 'texture', label: 'Wall texture', cls: 'right-[4%] top-[2%] w-[36vw] aspect-square md:w-[18vw]', speed: -70 },
  { kind: 'flooring', label: 'Flooring', cls: 'left-[26%] top-[36%] w-[60vw] aspect-[16/9] md:w-[34vw] opacity-60', speed: -12 },
  { kind: 'trim', label: 'Trim', cls: 'right-[2%] top-[46%] w-[46vw] aspect-[4/3] md:w-[26vw]', speed: -48 },
  { kind: 'door', label: 'Doors', cls: 'left-[5%] top-[62%] w-[34vw] aspect-[3/4] md:w-[17vw]', speed: -80 },
  { kind: 'window', label: 'Windows', cls: 'right-[22%] top-[74%] w-[38vw] aspect-[4/5] md:w-[20vw]', speed: -26 },
  { kind: 'tile', label: 'Tile', cls: 'left-[36%] top-[88%] w-[40vw] aspect-[4/3] md:w-[21vw]', speed: -56 },
]

export default function Craft() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        q('.cr-plate').forEach((el, i) => {
          gsap.to(el, {
            yPercent: plates[i].speed,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          })
          // slow camera push inside each frame
          gsap.fromTo(
            el.querySelector('svg'),
            { scale: 1.25 },
            { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }
          )
        })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1.2 },
        })
        tl.fromTo(q('.cr-a span'), { yPercent: 110 }, { yPercent: 0, stagger: 0.1, duration: 0.3 })
          .to({}, { duration: 0.4 })
          .to(q('.cr-a span'), { yPercent: -110, stagger: 0.08, duration: 0.3 })
          .fromTo(q('.cr-b span'), { yPercent: 110 }, { yPercent: 0, stagger: 0.1, duration: 0.3 }, '<0.1')
          .to({}, { duration: 0.4 })

        // rhythm: stud-like bars respond to scroll velocity (visual beat, no audio)
        const bars = q('.cr-bar')
        const setters = bars.map((b) => gsap.quickTo(b, 'scaleY', { duration: 0.5, ease: 'power3.out' }))
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const v = Math.min(1, Math.abs(self.getVelocity()) / 2500)
            setters.forEach((set, i) => set(0.15 + v * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.7 + self.progress * 20)))))
          },
        })
        return () => st.kill()
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} aria-labelledby="craft-title" className="grain relative h-[280svh] overflow-clip bg-coal motion-reduce:h-auto">
      <div className="absolute inset-0 motion-reduce:relative motion-reduce:grid motion-reduce:grid-cols-2 motion-reduce:gap-4 motion-reduce:p-5">
        {plates.map((p) => (
          <figure key={p.kind} className={`cr-plate absolute overflow-hidden motion-reduce:static motion-reduce:w-auto ${p.cls}`}>
            <DetailPlate kind={p.kind} id={`craft-${p.kind}`} className="h-full w-full" />
            <figcaption className="mono-tag absolute bottom-3 left-3 text-bone/80">{p.label}</figcaption>
          </figure>
        ))}
      </div>

      <div className="pointer-events-none sticky top-0 z-10 flex h-svh items-center justify-center px-5 motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <div className="grid text-center">
          <h2 id="craft-title" className="cr-a display text-[16vw] text-bone [grid-area:1/1] md:text-[10vw]">
            <span className="block overflow-hidden"><span className="block">Details</span></span>
            <span className="block overflow-hidden"><span className="block text-gold">matter.</span></span>
          </h2>
          <p className="cr-b display text-[11vw] text-bone [grid-area:1/1] md:text-[6.6vw] motion-reduce:[grid-area:2/1] motion-reduce:mt-10">
            <span className="block overflow-hidden"><span className="block">Quality work</span></span>
            <span className="block overflow-hidden"><span className="cine block normal-case tracking-normal text-gold">that lasts longer.</span></span>
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-8 flex h-16 items-end justify-center gap-[6px] motion-reduce:hidden" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <span key={i} className="cr-bar block h-full w-[3px] origin-bottom scale-y-[0.15] bg-gold/60" />
          ))}
        </div>
      </div>

    </section>
  )
}
