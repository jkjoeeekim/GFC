import { useEffect, useRef } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import type { Sermon } from '../../content/mediaTypes'

export function MediaDialog({ sermon, onClose }: { sermon: Sermon | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!sermon) return
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const element = ref.current
    element?.showModal()
    return () => {
      element?.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [sermon])
  if (!sermon) return null
  return <dialog ref={ref} className="media-dialog" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }} aria-labelledby="media-title">
    <div className="dialog-top"><p>Sunday teaching</p><button className="icon-button" aria-label="Close player" onClick={onClose} autoFocus><X /></button></div>
    {sermon.kind === 'video' ? <iframe src={sermon.src} title={sermon.title} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <div className="audio-player"><img src={sermon.localImage || sermon.image || '/images/home-0.webp'} alt="" /><audio controls src={sermon.src} preload="metadata">Your browser does not support audio playback. <a href={sermon.src}>Open the original recording</a>.</audio></div>}
    <div className="dialog-caption"><h2 id="media-title">{sermon.title}</h2>{sermon.author && <p>{sermon.author}</p>}<a className="text-link" href={sermon.kind === 'video' ? `https://www.youtube.com/watch?v=${sermon.id}` : sermon.src} target="_blank" rel="noreferrer">{sermon.kind === 'video' ? 'Open on YouTube' : 'Open original audio'}<ArrowUpRight size={16} /></a></div>
  </dialog>
}
