import { useState } from 'react'
import { MediaDialog, SermonPoster } from '../../components/shared'
import { useChurchContent, useLatestSermonContent } from '../../content/useContent'
import latestDefault from '../../data/latest.json'
import { ArrowUpRight } from 'lucide-react'
import { SiteLink } from '../../components/SiteLink'

export function Teaching() {
  const core = useChurchContent()
  const latest = useLatestSermonContent(latestDefault)
  const [videoOpen, setVideoOpen] = useState(false)
  return (<><section className="teaching-section container" data-sc-act="flow"><div className="teaching-copy" data-sc-in><span className="section-label">Rooted in the Word</span><h2>Faith for<br /> everyday life.</h2><p>Listen along with God’s Family Church. Explore Sunday messages, grow in the Word, and revisit a sermon that stayed with you.</p><SiteLink href="/listen" className="text-link">Explore the sermon archive <ArrowUpRight size={18} /></SiteLink><div className="podcast-note"><span>Take the message with you</span><div><a href={core.socials[4].href} target="_blank" rel="noreferrer">Spotify <ArrowUpRight size={13} /></a><a href={core.socials[5].href} target="_blank" rel="noreferrer">Apple Podcasts <ArrowUpRight size={13} /></a></div></div></div><div className="latest-feature"><SermonPoster sermon={latest} onPlay={() => setVideoOpen(true)} /><div className="latest-caption"><span>Our most recent sermon</span><p>{latest.title}</p></div></div></section><MediaDialog sermon={videoOpen ? latest : null} onClose={() => setVideoOpen(false)} /></>)
}
