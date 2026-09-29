'use client'

import { useRef } from 'react'
import { gsap, useGSAP, MQ } from '@/lib/gsap'
import Reveal from '@/components/ui/Reveal'

function LicensedIcon() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20" fill="none" stroke="#8F6C2F" strokeWidth="1.2" aria-hidden="true">
      <path className="ti-draw" d="M14 6h40l12 12v56H14z" />
      <path className="ti-draw" d="M54 6v12h12" />
      <path className="ti-draw" d="M22 20h22M22 28h30M22 36h26" strokeOpacity="0.6" />
      <path className="ti-draw" d="M14 58h52M40 58v16" strokeOpacity="0.6" />
      <circle className="ti-draw" cx="54" cy="44" r="9" />
      <path className="ti-draw" d="M49.5 44l3 3 6-6" />
    </svg>
  )
}

function InsuredIcon() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20" fill="none" stroke="#8F6C2F" strokeWidth="1.2" aria-hidden="true">
      <path className="ti-draw" d="M40 6L68 16V38C68 56 56 68 40 74C24 68 12 56 12 38V16Z" />
      <path className="ti-draw" d="M12 38H68M40 6V74M12 16L40 38L68 16M12 38L40 74L68 38" strokeOpacity="0.45" />
    </svg>
  )
}

function ReliableIcon() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20" fill="none" stroke="#8F6C2F" strokeWidth="1.2" aria-hidden="true">
      <path className="ti-draw" d="M10 10v60h60v-10H20V10z" />
      <path className="ti-draw" d="M20 20h-4M20 30h-6M20 40h-4M20 50h-6M30 60v4M40 60v6M50 60v4M60 60v6" strokeOpacity="0.6" />
      <rect className="ti-draw" x="30" y="26" width="40" height="12" />
      <path className="ti-draw" d="M44 28v8M56 28v8" strokeOpacity="0.5" />
      <circle className="ti-bubble" cx="40" cy="32" r="3" fill="#8F6C2F" stroke="none" />
    </svg>
  )
}

const items = [
  { word: 'Licensed', Icon: LicensedIcon },
  { word: 'Insured', Icon: InsuredIcon },
  { word: 'Reliable', Icon: ReliableIcon },
]

export default function Trust() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from(q('.ti-draw'), {
          drawSVG: '0%',
          duration: 1.6,
          stagger: 0.05,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        })
        // the level's bubble settles to center
        gsap.fromTo(
          q('.ti-bubble'),
          { attr: { cx: 34 } },
          { attr: { cx: 50 }, duration: 2.2, ease: 'elastic.out(1, 0.35)', delay: 0.8, scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } }
        )
        gsap.from(q('.ti-rule'), {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 1.2,
          stagger: 0.15,
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        })
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} aria-labelledby="trust-title" className="relative bg-char py-24 text-bone md:py-36">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="eyebrow flex items-center gap-4 text-[#6b5628]">
          <span className="h-px w-10 bg-bronze" /> Why Ambrocio
        </p>
        <h2 id="trust-title" className="sr-only">
          Licensed, insured and reliable
        </h2>
        <ul className="mt-14 grid gap-14 md:grid-cols-3 md:gap-0">
          {items.map(({ word, Icon }, i) => (
            <li key={word} className="relative md:px-10 md:first:pl-0">
              {i > 0 && <span className="ti-rule absolute left-0 top-0 hidden h-full w-px bg-bone/15 md:block" />}
              <Icon />
              <p className="mono-tag mt-8 text-[#6b5628]">0{i + 1}</p>
              <p className="display mt-2 text-[15vw] md:text-[5.2vw]">{word}</p>
            </li>
          ))}
        </ul>
        <div className="mt-20 flex flex-col gap-6 border-t border-bone/15 pt-10 md:mt-28 md:flex-row md:items-end md:justify-between">
          <Reveal as="p" by="lines" className="display text-[11vw] md:text-[5.4vw]">
            Quality work <span className="cine normal-case tracking-normal text-[#6b5628]">that lasts longer.</span>
          </Reveal>
          <p className="mono-tag max-w-xs text-bone/60">Build · Remodel · Improve — Residential &amp; Commercial</p>
        </div>
      </div>
    </section>
  )
}
