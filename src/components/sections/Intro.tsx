'use client'

import { useRef } from 'react'
import { gsap, SplitText, useGSAP, MQ } from '@/lib/gsap'
import { site } from '@/content/site'

/** Floor plan linework that draws itself behind the statement. */
function FloorPlan() {
  const walls =
    'M80 80H920V620H80Z' + // exterior
    'M80 330H420M500 330H560V620M560 440H920M700 80V250M700 330V440M420 80V260' + // interior walls
    'M300 620V480H80'
  const doors = 'M420 260A70 70 0 0 1 490 330M700 250A80 80 0 0 0 620 330M560 440A60 60 0 0 1 620 500M300 480A60 60 0 0 1 240 420'
  const dims = 'M80 40H920M80 30V50M420 30V50M700 30V50M920 30V50M960 80V620M950 80H970M950 330H970M950 620H970'
  return (
    <svg viewBox="0 0 1000 680" className="h-full w-full" aria-hidden="true" fill="none">
      <path className="fp-walls" d={walls} stroke="#8F6C2F" strokeWidth="3" />
      <path className="fp-doors" d={doors} stroke="#2B2620" strokeOpacity="0.5" strokeWidth="1" />
      <path className="fp-dims" d={dims} stroke="#8F6C2F" strokeOpacity="0.5" strokeWidth="1" />
      <g className="fp-labels" fill="#8F6C2F" fontFamily="monospace" fontSize="13" letterSpacing="3" opacity="0.7">
        <text x="180" y="200">KITCHEN</text>
        <text x="520" y="190">LIVING</text>
        <text x="760" y="180">BATH</text>
        <text x="700" y="540">BEDROOM</text>
        <text x="130" y="560">PATIO</text>
        <text x="360" y="480">HALL</text>
      </g>
    </svg>
  )
}

export default function Intro() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        // floor plan draws as the section passes
        gsap.set(q('.fp-walls, .fp-doors, .fp-dims'), { drawSVG: '0%' })
        const plan = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'bottom 30%', scrub: 1.2 },
        })
        plan
          .to(q('.fp-walls'), { drawSVG: '100%', duration: 1, ease: 'none' })
          .to(q('.fp-doors'), { drawSVG: '100%', duration: 0.5, ease: 'none' }, 0.5)
          .to(q('.fp-dims'), { drawSVG: '100%', duration: 0.5, ease: 'none' }, 0.6)
          .from(q('.fp-labels'), { opacity: 0, duration: 0.3 }, 0.8)
          .to(q('.fp-wrap'), { opacity: 0, duration: 0.4 }, 1.2)

        // statement lines enter, then drift at different depths
        const lines = q('.st-line')
        lines.forEach((line, i) => {
          const split = SplitText.create(line, { type: 'words', mask: 'words' })
          gsap.from(split.words, {
            yPercent: 110,
            duration: 1.3,
            ease: 'expo.out',
            stagger: 0.07,
            scrollTrigger: { trigger: line, start: 'top 85%', once: true },
          })
          gsap.to(line, {
            yPercent: (i + 1) * (window.innerWidth < 768 ? -4 : -18),
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
        gsap.from(q('.st-body'), {
          opacity: 0,
          y: 40,
          duration: 1.2,
          scrollTrigger: { trigger: q('.st-body')[0], start: 'top 88%', once: true },
        })
        gsap.to(q('.st-body'), {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    },
    { scope: root }
  )

  return (
    <section id="about" ref={root} tabIndex={-1} className="relative overflow-hidden bg-ink py-[22svh] outline-none md:py-[30svh]">
      <div className="fp-wrap pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.22]">
        <div className="aspect-[1000/680] w-[140vw] md:w-[80vw]">
          <FloorPlan />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="eyebrow mb-10 flex items-center gap-4 text-gold">
          <span className="h-px w-10 bg-gold" /> About Ambrocio
        </p>
        <h2 className="display text-[11vw] text-bone md:text-[8.4vw]">
          <span className="st-line block">We don&apos;t</span>
          <span className="st-line block md:pl-[12vw]">just build.</span>
          <span className="st-line block text-gold md:pl-[4vw]">We transform</span>
          <span className="st-line block md:pl-[22vw]">spaces.</span>
        </h2>
        <div className="st-body mt-16 grid gap-8 md:ml-auto md:mt-24 md:max-w-[46rem] md:grid-cols-[auto_1fr]">
          <span className="mono-tag pt-2 text-gold">A—01</span>
          <div>
            <p className="text-lg leading-relaxed text-bone/80 md:text-2xl md:leading-[1.55]">
              From new construction to thoughtful remodeling, Ambrocio Construction &amp; Remodeling brings craftsmanship,
              structure and attention to detail to residential and commercial spaces throughout the DFW Metroplex and
              surrounding areas.
            </p>
            <p className="cine mt-8 text-2xl text-gold md:text-3xl">{site.taglines.bigger}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
