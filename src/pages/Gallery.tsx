import { PhotoGrid } from '../components/gallery/PhotoGrid'
import { PhotoLightbox } from '../components/gallery/PhotoLightbox'
import { useState } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { ConnectBand, MotionPage, PageIntro } from '../components/shared'
import defaultData from '../data/gallery.json'
import { useChurchContent, useGalleryContent } from '../content/useContent'
import { prioritizeAlbumPhotos } from '../lib/gallery'

export default function Gallery() {
  const data = useGalleryContent(defaultData)
  const core = useChurchContent()
  const [year, setYear] = useState(data[0].year)
  const [limit, setLimit] = useState(18)
  const [photo, setPhoto] = useState<number | null>(null)
  const sourceAlbum = data.find(a => a.year === year) || data[0]
  const album = { ...sourceAlbum, photos: prioritizeAlbumPhotos(sourceAlbum.photos) }
  return <MotionPage className="gallery-page"><PageIntro label="Our gallery" title="Life together looks like this." description="Curious about who we are and what we’re like? These are some of the people, places, and moments that make up our church family." />
    <section className="gallery-library container"><div className="gallery-tools"><div className="filter-tabs" role="group" aria-label="Choose a photo album">{data.map(a => <button key={a.year} aria-pressed={year === a.year} onClick={() => { setYear(a.year); setLimit(18) }}>{a.title}</button>)}</div><p role="status">{album.photos.length} photographs</p></div>
      <PhotoGrid photos={album.photos.slice(0, limit)} albumTitle={album.title} onOpen={setPhoto} />
      <div className="load-more"><p>Showing {Math.min(limit, album.photos.length)} of {album.photos.length} photographs</p>{limit < album.photos.length && <button className="button button-outline" onClick={() => setLimit(limit + 18)}>Load more photos <ArrowRight size={18} /></button>}</div>
    </section>
    <section className="more-memories container"><h2>More photos & videos</h2><div><a href={core.socials[1].href} target="_blank" rel="noreferrer">Explore Flickr albums <ArrowUpRight size={18} /></a><a href={core.socials[0].href} target="_blank" rel="noreferrer">GFC on YouTube <ArrowUpRight size={18} /></a></div></section><ConnectBand />
    {photo !== null && <PhotoLightbox album={album} index={photo} onChange={setPhoto} onClose={() => setPhoto(null)} />}
  </MotionPage>
}
