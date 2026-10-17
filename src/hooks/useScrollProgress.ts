import { useEffect } from 'react'
import type { RefObject } from 'react'

/** Event-driven motion uses DOM variables, so scroll never rerenders React content. */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, scene: 'hero' | 'table') {
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    function draw() {
      frame = 0
      const rect = element!.getBoundingClientRect()
      const progress = scene === 'hero' ? -rect.top / Math.max(rect.height, 1) : (innerHeight * .85 - rect.top) / Math.max(rect.height * .65, 1)
      element!.style.setProperty(scene === 'hero' ? '--hero-p' : '--table-p', String(reduced.matches ? (scene === 'hero' ? 0 : 1) : Math.max(0, Math.min(1, progress))))
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(draw) }
    draw()
    const resize = new ResizeObserver(schedule)
    resize.observe(element)
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
    reduced.addEventListener('change', schedule)
    return () => { resize.disconnect(); removeEventListener('scroll', schedule); removeEventListener('resize', schedule); reduced.removeEventListener('change', schedule); cancelAnimationFrame(frame) }
  }, [ref, scene])
}
