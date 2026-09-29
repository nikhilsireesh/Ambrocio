'use client'

import { useRef } from 'react'
import { gsap, useGSAP, MQ } from '@/lib/gsap'
import { featurePhotos } from '@/content/media'
import Media from '@/components/ui/Media'
import HouseElevation from '@/components/svg/HouseElevation'
import Room from '@/components/svg/Room'
import DetailPlate from '@/components/svg/DetailPlates'

const panels = [
  {
    word: 'Build',
    line: 'New construction from foundation to finished space.',
    photo: featurePhotos.build,
    art: <HouseElevation static="framing" id="pillar-house" className="h-full w-full" />,
  },
  {
    word: 'Remodel',
    line: 'Transform existing spaces.',
    photo: featurePhotos.remodel,
    art: <Room show="after" id="pillar-room" className="h-full w-full" />,
  },
  {
    word: 'Improve',
    line: 'Upgrade the details that make a space feel complete.',
    photo: featurePhotos.improve,
    art: <DetailPlate kind="door" id="pillar-door" className="h-full w-full" />,
  },
]

export default function Pillars() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const p = q('.pl-panel')
        const art = q('.pl-art')
        const words = q('.pl-word')
        const copy = q('.pl-copy')

        gsap.set(p[1], { clipPath: 'inset(0% 0% 0% 100%)' })
        gsap.set(p[2], { clipPath: 'circle(0% at 50% 55%)' })
        gsap.set(art, { scale: 1.25 })
        gsap.set(words, { yPercent: 100 })
        gsap.set(copy, { autoAlpha: 0, y: 30 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=320%',
            pin: true,
            scrub: 1.4,
            anticipatePin: 1,
          },
        })

        // BUILD slides in (the section itself enters; art settles, word rises)
        tl.fromTo(p[0], { clipPath: 'inset(35% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.out' }, 0)
          .to(art[0], { scale: 1, duration: 1.2 }, 0)
          .to(words[0], { yPercent: 0, duration: 0.5, ease: 'power3.out' }, 0.15)
          .to(copy[0], { autoAlpha: 1, y: 0, duration: 0.4 }, 0.35)

        // REMODEL overlaps from the right
          .to(p[1], { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, 1.3)
          .to(p[0], { scale: 0.92, opacity: 0.35, duration: 1 }, 1.3)
          .to(art[1], { scale: 1, duration: 1.4 }, 1.3)
          .to(words[1], { yPercent: 0, duration: 0.5, ease: 'power3.out' }, 1.8)
          .to(copy[1], { autoAlpha: 1, y: 0, duration: 0.4 }, 2)

        // IMPROVE replaces through an opening aperture
          .to(p[2], { clipPath: 'circle(75% at 50% 55%)', duration: 1.1, ease: 'power2.in' }, 2.8)
          .to(p[1], { scale: 0.92, opacity: 0.35, duration: 1 }, 2.8)
          .to(art[2], { scale: 1, duration: 1.4 }, 2.8)
          .to(words[2], { yPercent: 0, duration: 0.5, ease: 'power3.out' }, 3.4)
          .to(copy[2], { autoAlpha: 1, y: 0, duration: 0.4 }, 3.6)
          .to({}, { duration: 0.5 })
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} aria-label="Build, remodel, improve" className="relative h-svh overflow-hidden bg-ink motion-reduce:h-auto">
      {panels.map((panel, i) => (
        <article
          key={panel.word}
          className="pl-panel absolute inset-0 overflow-hidden bg-ink will-change-[clip-path] motion-reduce:relative motion-reduce:h-svh"
          style={{ zIndex: i + 1 }}
        >
          <Media photo={panel.photo} className="pl-art absolute inset-0">
            {panel.art}
          </Media>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/10 to-transparent" />

          <div className="relative flex h-full flex-col justify-end px-5 pb-[10svh] md:px-10 md:pb-[12svh]">
            <div className="mx-auto w-full max-w-[1500px]">
              <p className="mono-tag mb-4 text-gold">
                {String(i + 1).padStart(2, '0')} / 03
              </p>
              <h2 className="overflow-hidden">
                <span className="pl-word display block text-[15vw] text-bone md:text-[15vw]">{panel.word}</span>
              </h2>
              <div className="pl-copy mt-4 flex max-w-xl items-start gap-5 md:mt-6">
                <span className="mt-3 h-px w-12 shrink-0 bg-gold" />
                <p className="cine text-2xl text-bone/90 md:text-4xl">{panel.line}</p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
