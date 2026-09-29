'use client'

import { useRef } from 'react'
import { gsap, SplitText, useGSAP, MQ } from '@/lib/gsap'
import HouseElevation from '@/components/svg/HouseElevation'
import DetailPlate from '@/components/svg/DetailPlates'

export default function Sectors() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(
        { desktop: MQ.desktop, mobile: MQ.mobile },
        (ctx) => {
          const { mobile } = ctx.conditions as { desktop: boolean; mobile: boolean }
          const split = SplitText.create(q('.sec-merge'), { type: 'words', mask: 'words' })
          gsap.set(split.words, { yPercent: 110 })

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: root.current, start: 'top top', end: '+=260%', pin: true, scrub: 1.4, anticipatePin: 1 },
          })
          // halves glide toward the center seam
          tl.to(q('.sec-left'), { clipPath: mobile ? 'inset(38% 0% 0% 0%)' : 'inset(0% 0% 0% 40%)', duration: 1.2, ease: 'power1.inOut' }, 0.3)
            .to(q('.sec-right'), { clipPath: mobile ? 'inset(0% 0% 38% 0%)' : 'inset(0% 40% 0% 0%)', duration: 1.2, ease: 'power1.inOut' }, 0.3)
            .to(q('.sec-copy'), { autoAlpha: 0, y: -20, duration: 0.4, stagger: 0.1 }, 0.3)
            .to(q('.sec-art'), { scale: 1.2, duration: 1.6 }, 0.3)
            .to(q('.sec-seam'), { scaleY: 1, duration: 0.6 }, 1.1)
            // merge
            .to(q('.sec-left, .sec-right'), { opacity: 0.18, duration: 0.6 }, 1.5)
            .to(split.words, { yPercent: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, 1.6)
            .to({}, { duration: 0.5 })

          return () => split.revert()
        }
      )
    },
    { scope: root }
  )

  return (
    <section ref={root} aria-labelledby="sectors-title" className="relative h-svh overflow-hidden bg-ink motion-reduce:h-auto">
      <h2 id="sectors-title" className="sr-only">
        Residential and commercial
      </h2>
      <div className="grid h-full grid-rows-2 md:grid-cols-2 md:grid-rows-1 motion-reduce:min-h-svh">
        <article className="sec-left relative overflow-hidden [clip-path:inset(0%_0%_0%_0%)]">
          <div className="sec-art absolute inset-0">
            <HouseElevation static="finished" id="sec-house" className="h-full w-full" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="sec-copy absolute inset-x-0 bottom-0 p-6 md:p-12">
            <p className="mono-tag text-gold">01 · Sector</p>
            <h3 className="display mt-2 text-[10.5vw] text-bone md:text-[4.6vw]">Residential</h3>
            <ul className="display-wide mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-bone/75 md:text-sm">
              <li>Modern homes</li>
              <li>Remodeling</li>
              <li>Interior transformations</li>
              <li>Construction work</li>
            </ul>
          </div>
        </article>
        <article className="sec-right relative overflow-hidden [clip-path:inset(0%_0%_0%_0%)]">
          <div className="sec-art absolute inset-0">
            <DetailPlate kind="commercial" id="sec-com" className="h-full w-full" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="sec-copy absolute inset-x-0 bottom-0 p-6 md:p-12 md:text-right">
            <p className="mono-tag text-gold">02 · Sector</p>
            <h3 className="display mt-2 text-[10.5vw] text-bone md:text-[4.6vw]">Commercial</h3>
            <p className="display-wide mt-4 text-xs text-bone/75 md:text-sm">Commercial construction and improvement</p>
          </div>
        </article>
      </div>

      <span className="sec-seam pointer-events-none absolute left-1/2 top-0 hidden h-full w-px origin-top scale-y-0 bg-gold/70 md:block" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-5 text-center motion-reduce:static motion-reduce:py-24">
        <p className="sec-merge display text-[12vw] text-bone md:text-[7.5vw]">
          Spaces built <br />
          for <span className="cine normal-case tracking-normal text-gold">what&apos;s next.</span>
        </p>
      </div>
    </section>
  )
}
