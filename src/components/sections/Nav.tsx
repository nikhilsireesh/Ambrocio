'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { navItems, site, telHref } from '@/content/site'
import { lockScroll, onAnchorClick } from '@/lib/scroll'
import Button from '@/components/ui/Button'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menu = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    lockScroll(open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
      if (e.key === 'Tab' && menu.current) {
        const f = menu.current.querySelectorAll<HTMLElement>('a, button')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    menu.current?.querySelector<HTMLElement>('a')?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useGSAP(
    () => {
      if (!open || !menu.current) return
      const q = gsap.utils.selector(menu)
      gsap.fromTo(menu.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' })
      gsap.fromTo(q('.m-link'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06, delay: 0.3, ease: 'expo.out' })
      gsap.fromTo(q('.m-foot'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.6 })
    },
    { dependencies: [open] }
  )

  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false)
    lockScroll(false)
    onAnchorClick(e)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[90] transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled && !open ? 'border-b border-gold/25 bg-ink/80 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <nav aria-label="Primary" className="mx-auto flex h-[var(--nav-h)] max-w-[1500px] items-center justify-between px-5 md:px-10">
          <a href="#home" onClick={go} className="group flex items-baseline gap-3" aria-label="Ambrocio Construction & Remodeling — back to top">
            <span className="display text-2xl tracking-[0.02em] text-bone md:text-[1.7rem]">Ambrocio</span>
            <span className="hidden h-3 w-px bg-gold/60 lg:block" />
            <span className="mono-tag hidden text-bone/60 lg:block">Construction &amp; Remodeling</span>
          </a>

          <ul className="hidden items-center gap-8 xl:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={go}
                  className="group relative py-2 font-display text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-bone/75 transition-colors [font-stretch:112%] hover:text-bone"
                >
                  {item.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Button href="#contact" variant="solid" className="min-h-[44px]! px-5! text-[0.7rem]!">
                Free Estimate
              </Button>
            </div>
            <button
              ref={toggle}
              type="button"
              className="relative grid h-11 w-11 place-items-center xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`absolute h-px w-6 bg-bone transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-1'}`} />
              <span className={`absolute h-px w-6 bg-gold transition-transform duration-500 ${open ? '-rotate-45' : 'translate-y-1'}`} />
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div
          id="mobile-menu"
          ref={menu}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="blueprint-grid fixed inset-0 z-[80] flex flex-col bg-ink px-5 pb-8 pt-[calc(var(--nav-h)+4svh)] md:px-10"
        >
          <ul className="flex flex-1 flex-col justify-center gap-1">
            {navItems.map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <a href={item.href} onClick={go} className="m-link flex items-baseline gap-4 py-1">
                  <span className="mono-tag text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display text-[12vw] text-bone md:text-[7vw]">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="m-foot flex flex-col gap-5 border-t border-gold/25 pt-6">
            <a href={telHref} className="display-wide text-xl text-bone">
              {site.contact.name} · <span className="text-gold">{site.contact.phoneDisplay}</span>
            </a>
            <p className="mono-tag text-bone/60">English / Español · {site.area}</p>
            <Button href="#contact" onClick={() => setOpen(false)} variant="solid" className="self-start">
              Request a Free Estimate
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
