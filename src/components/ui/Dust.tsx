'use client'

import { useEffect, useRef } from 'react'

/** Low-density ambient dust drifting through light. Pauses offscreen and for reduced motion. */
export default function Dust({ density = 55, className = '' }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const count = window.innerWidth < 768 ? Math.round(density * 0.5) : density
    let w = 0
    let h = 0
    let raf = 0
    let visible = true

    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; t: number }
    let parts: P[] = []

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -Math.random() * 0.12 - 0.02,
        a: Math.random() * 0.5 + 0.1,
        t: Math.random() * Math.PI * 2,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.t += 0.01
        p.x += p.vx + Math.sin(p.t) * 0.08
        p.y += p.vy
        if (p.y < -5) p.y = h + 5
        if (p.x < -5) p.x = w + 5
        if (p.x > w + 5) p.x = -5
        ctx.beginPath()
        ctx.fillStyle = `rgba(160, 120, 55, ${p.a * (0.6 + Math.sin(p.t * 2) * 0.4)})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (visible) raf = requestAnimationFrame(draw)
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(draw)
    })

    resize()
    io.observe(canvas)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [density])

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}
