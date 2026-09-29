'use client'

import type Lenis from 'lenis'

let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

export function getLenis() {
  return lenis
}

/** Scroll to a section id ("#services") or a pixel offset, using Lenis when it's running. */
export function scrollToTarget(target: string | number) {
  if (lenis) {
    lenis.scrollTo(target, { force: true, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target })
    return
  }
  document.querySelector(target)?.scrollIntoView()
}

/** Pause smooth scrolling while overlays (menu, loader, lightbox) are open. */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.classList.toggle('scroll-locked', locked)
}

/** Click handler for in-page anchors: keeps real hrefs (keyboard / no-JS friendly) but scrolls smoothly. */
export function onAnchorClick(e: React.MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute('href')
  if (!href || !href.startsWith('#')) return
  e.preventDefault()
  scrollToTarget(href)
  history.replaceState(null, '', href)
  const el = document.querySelector<HTMLElement>(href)
  el?.focus({ preventScroll: true })
}
