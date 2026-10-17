import { useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { SiteLink } from '../../components/SiteLink'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { useSiteContent } from '../../content/useContent'
const seasons = [
  { name: 'Young adults & married couples', query: 'adults', detail: 'Build faith and share everyday life.' },
  { name: 'College', query: 'college', detail: 'Find community in your college years.' },
  { name: 'Youth', query: 'youth', detail: 'Grow together with Catalyst.' },
]

export function CommunityTable() {
  const table = useRef<HTMLElement>(null)
  useScrollProgress(table, 'table')
  const [season, setSeason] = useState(0)
  const content = useSiteContent().home.community
  return (<section ref={table} className="table-section" data-sc-act="flow" aria-labelledby="table-title">
      <div className="container table-inner"><div className="table-heading"><h2 id="table-title">{content.headingLine1}<br />{content.headingLine2}</h2><p>{content.description}</p></div>
        <div className="table-photos"><svg className="table-trace" viewBox="0 0 1200 420" fill="none" aria-hidden="true"><path pathLength="1" d="M12 360V220L600 20l588 200v140M160 393H1040" /></svg>
          <figure className="table-photo table-photo-one"><img src="/images/house-church-0.webp" width="1000" height="750" alt="House church members spending an evening together" loading="lazy" /><figcaption>Come together.</figcaption></figure>
          <figure className="table-photo table-photo-two"><img src="/images/house-church-4.webp" width="1000" height="750" alt="Friends sharing food at a GFC house church gathering" loading="lazy" /><figcaption>Share life.</figcaption></figure>
          <figure className="table-photo table-photo-three"><img src="/images/house-church-2.webp" width="1000" height="750" alt="A house church family gathered in a member’s home" loading="lazy" /><figcaption>Grow in faith.</figcaption></figure>
        </div>
        <div className="table-bottom"><div><h3>Find your people.</h3><p>Our house churches meet on {content.meetingDays}.<br />There’s a community for your season of life.</p></div><div className="season-picker"><div className="season-tabs" role="group" aria-label="Your season of life">{seasons.map((s, i) => <button key={s.query} aria-pressed={season === i} onClick={() => setSeason(i)}>{s.name}</button>)}</div><div className="season-result" aria-live="polite"><p>{seasons[season].detail}</p><SiteLink className="text-link" href={`/house-church?stage=${seasons[season].query}`}>Find a house church <ArrowRight size={18} /></SiteLink></div></div></div>
      </div>
    </section>)
}
