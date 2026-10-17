import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import type { GalleryContent } from '../../content/useContent'

type Props = { album: GalleryContent[number]; index: number; onChange: (index: number) => void; onClose: () => void }

export function PhotoLightbox({ album, index, onChange, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const selected = album.photos[index]
  useEffect(() => {
    const previousFocus = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const element = dialog.current
    element?.showModal()
    return () => {
      element?.close()
      document.body.style.overflow = overflow
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [])
  function step(direction: number) { onChange((index + direction + album.photos.length) % album.photos.length) }
  return <dialog className="photo-dialog" ref={dialog} aria-label={`${album.title} photo viewer`} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }} onKeyDown={e => { if (e.key === 'ArrowRight') { e.preventDefault(); step(1) } if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) } }}><div className="dialog-top"><p>{album.title}</p><button className="icon-button" onClick={onClose} aria-label="Close photo viewer" autoFocus><X /></button></div><div className="lightbox-image"><img src={selected.local || selected.url + '?format=1500w'} alt={`${album.title}, photograph ${index + 1}`} /><button className="icon-button photo-prev" onClick={() => step(-1)} aria-label="Previous photograph"><ArrowLeft /></button><button className="icon-button photo-next" onClick={() => step(1)} aria-label="Next photograph"><ArrowRight /></button></div><div className="lightbox-bottom"><p aria-live="polite">{index + 1} / {album.photos.length}</p><a href={selected.url} target="_blank" rel="noreferrer">Open original <ArrowUpRight size={15} /></a></div></dialog>
}
