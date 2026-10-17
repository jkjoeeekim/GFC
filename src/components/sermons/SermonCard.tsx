import { Headphones } from 'lucide-react'
import { SermonPoster } from '../ui/SermonPoster'
import type { Sermon } from '../../content/mediaTypes'

export function SermonCard({ sermon, seriesTitle, onPlay }: { sermon: Sermon; seriesTitle?: string; onPlay: () => void }) {
  return <article className="sermon-item"><SermonPoster sermon={sermon} onPlay={onPlay} /><div className="sermon-item-copy"><p className="sermon-series">{seriesTitle}</p><h2><button onClick={onPlay}>{sermon.title}</button></h2><div className="sermon-item-meta"><span>{sermon.kind === 'audio' ? <><Headphones size={14} />Audio recording</> : 'Sunday teaching'}</span>{sermon.duration ? <span>{Math.round(sermon.duration / 60000)} min</span> : null}</div></div></article>
}
