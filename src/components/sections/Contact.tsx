'use client'

import { useRef } from 'react'
import { gsap, useGSAP, MQ } from '@/lib/gsap'
import { site, telHref } from '@/content/site'
import { featurePhotos } from '@/content/media'
import Media from '@/components/ui/Media'
import HouseElevation from '@/components/svg/HouseElevation'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'
import EstimateForm from './EstimateForm'

export default function Contact() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        // the image opens up like a doorway as it arrives
        gsap.fromTo(
          q('.ct-frame'),
          { clipPath: 'inset(12% 18% 12% 18%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: q('.ct-hero')[0], start: 'top bottom', end: 'top top', scrub: true } }
        )
        gsap.fromTo(q('.ct-art'), { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: q('.ct-hero')[0], start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    },
    { scope: root }
  )

  return (
    <section id="contact" ref={root} tabIndex={-1} aria-labelledby="contact-title" className="relative bg-ink outline-none">
      <div className="ct-hero relative h-[110svh] min-h-[680px]">
        <div className="ct-frame absolute inset-0 overflow-hidden">
          <Media photo={featurePhotos.finishedHome} className="ct-art absolute inset-0">
            <HouseElevation static="finished" id="cta-house" className="h-full w-full" />
          </Media>
          <div className="absolute inset-0 bg-ink/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
        </div>

        <div className="relative flex h-full flex-col justify-center px-5 md:px-10">
          <div className="mx-auto w-full max-w-[1500px]">
            <p className="eyebrow flex items-center gap-4 text-gold">
              <span className="h-px w-10 bg-gold" /> Free Estimates
            </p>
            <Reveal as="h2" by="lines" id="contact-title" className="display mt-6 max-w-[14ch] text-[10.6vw] text-bone md:text-[7.4vw]">
              Ready to build something better?
            </Reveal>
            <Reveal as="p" by="words" from="right" delay={0.2} className="cine mt-6 text-[7vw] text-gold md:text-[3vw]">
              Let&apos;s bring your vision to life.
            </Reveal>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="#estimate" variant="solid">Request a Free Estimate</Button>
              <Button href={telHref} variant="ghost">Call {site.contact.phoneDisplay}</Button>
            </div>
          </div>
        </div>
      </div>

      <div id="estimate" className="blueprint-grid relative border-t border-gold/20 bg-coal" tabIndex={-1}>
        <div className="mx-auto grid max-w-[1500px] gap-16 px-5 py-24 *:min-w-0 md:grid-cols-[minmax(0,26rem)_1fr] md:gap-20 md:px-10 md:py-32">
          <aside className="flex flex-col gap-10">
            <div>
              <p className="mono-tag text-gold">Sheet E-01 · Estimate request</p>
              <h3 className="display mt-4 text-[7.4vw] text-bone md:text-[2.6rem]">Start the conversation.</h3>
            </div>
            <dl className="grid gap-8 border-t border-bone/10 pt-8">
              <div>
                <dt className="mono-tag text-bone/50">Contact</dt>
                <dd className="mt-2">
                  <span className="display-wide block text-lg text-bone">{site.contact.name}</span>
                  <a href={telHref} className="display mt-1 block text-4xl text-gold hover:text-bone md:text-5xl">
                    {site.contact.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="mono-tag text-bone/50">Languages</dt>
                <dd className="display-wide mt-2 text-bone">English / Español</dd>
              </div>
              <div>
                <dt className="mono-tag text-bone/50">Service area</dt>
                <dd className="display-wide mt-2 text-bone">
                  DFW Metroplex
                  <br />&amp; Surrounding Areas
                </dd>
              </div>
            </dl>
          </aside>
          <EstimateForm />
        </div>
      </div>
    </section>
  )
}
