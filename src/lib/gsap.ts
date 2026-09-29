'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP)
  gsap.defaults({ ease: 'power3.out' })
  // mobile URL-bar show/hide shouldn't re-layout every pinned section mid-scroll
  ScrollTrigger.config({ ignoreMobileResize: true })
}

/** Media queries shared by every section so desktop / mobile / reduced-motion stay consistent. */
export const MQ = {
  desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const

export { gsap, ScrollTrigger, SplitText, useGSAP }
