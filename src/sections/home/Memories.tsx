import { MapPin } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { SiteLink } from '../../components/SiteLink'

export function Memories() {
  return (<section className="memories-section" data-sc-act="flow"><div className="container memories-heading"><div><h2>A little glimpse<br />of life together.</h2><p>Real people. Shared memories. One church family.</p></div><SiteLink href="https://gfchouse.com/gallery" className="text-link">Explore our gallery <ArrowUpRight size={18} /></SiteLink></div><div className="container memories-grid"><figure className="memory-large" data-sc-reveal="left" data-sc-reveal-at="0.05 0.22"><img src="/images/gallery-210.webp" alt="GFC members smiling together outdoors at a church retreat" width="1000" height="667" loading="lazy" data-sc-parallax="-.45" /></figure><figure><img src="/images/gallery-10.webp" alt="Two friends together at the 2026 winter retreat" width="1000" height="667" loading="lazy" /></figure><figure><img src="/images/gallery-35.webp" alt="Church friends laughing and posing together outside" width="1000" height="667" loading="lazy" data-sc-parallax=".3" /></figure></div><div className="container memory-footer"><span>Moments from our church family</span><span><MapPin size={13} />Together, wherever we gather.</span></div></section>)
}
