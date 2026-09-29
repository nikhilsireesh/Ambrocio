'use client'

// Tiny signal so the hero knows when the loading curtain has lifted.
let done = false
const listeners = new Set<() => void>()

export function markLoaded() {
  done = true
  listeners.forEach((fn) => fn())
  listeners.clear()
}

export function onLoaded(fn: () => void) {
  if (done) {
    fn()
    return () => {}
  }
  listeners.add(fn)
  return () => listeners.delete(fn)
}
