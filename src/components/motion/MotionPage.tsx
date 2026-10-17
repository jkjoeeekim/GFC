import { useEffect, useRef } from 'react'
import type { PropsWithChildren } from 'react'

declare global { interface Window { ScrollCraft?: { mount: (root: HTMLElement) => { destroy: () => void } } } }


export function MotionPage({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const engine = window.ScrollCraft?.mount(ref.current)
    return () => engine?.destroy()
  }, [])
  return <main id="main-content" tabIndex={-1} ref={ref} className={className}>{children}</main>
}
