import { Expand } from 'lucide-react'
import type { GalleryContent } from '../../content/useContent'

export function PhotoGrid({ photos, albumTitle, onOpen }: { photos: GalleryContent[number]['photos']; albumTitle: string; onOpen: (index: number) => void }) {
  return <div className="photo-grid">{photos.map((photo, index) => <button className="gallery-photo" key={photo.url} onClick={() => onOpen(index)} aria-label={`View ${albumTitle}, photograph ${index + 1}`}><img src={photo.local || photo.url + '?format=750w'} alt={`${albumTitle}, photograph ${index + 1}`} loading={index < 3 ? 'eager' : 'lazy'} width="800" height="600" /><span><Expand size={19} /></span></button>)}</div>
}
