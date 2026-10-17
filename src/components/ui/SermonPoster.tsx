import { ArrowUpRight, Play } from 'lucide-react'
import type { Sermon } from '../../content/mediaTypes'

export function SermonPoster({ sermon, onPlay, className = '' }: { sermon: Sermon; onPlay: () => void; className?: string }) {
  return <button className={`sermon-poster ${className}`} onClick={onPlay} aria-label={`Play ${sermon.title}`}>
    <img src={sermon.localImage || sermon.image || '/images/home-0.webp'} alt="" loading="lazy" width="900" height="506" />
    <span className="play-circle"><Play size={23} fill="currentColor" strokeWidth={1.4} /></span>
    <span className="poster-bottom">{sermon.kind === 'audio' ? 'Listen to the message' : 'Watch the message'}<ArrowUpRight size={18} /></span>
  </button>
}
