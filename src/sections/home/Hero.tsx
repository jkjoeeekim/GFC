import { useRef } from 'react'
import { Heart } from 'lucide-react'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { useSiteContent } from '../../content/useContent'
import { Action } from '../../components/shared'
import { ArrowUpRight } from 'lucide-react'
import { SiteLink } from '../../components/SiteLink'

export function Hero() {
  const hero = useRef<HTMLElement>(null)
  useScrollProgress(hero, 'hero')
  const site = useSiteContent()
  const content = site.home.hero
  return (<section ref={hero} className="home-hero" data-sc-act="flow" aria-labelledby="home-title">
      <div className="container hero-grid">
        <div className="hero-copy"><p className="eyebrow"><span className="little-line" />God’s Family Church · {site.service.city}, {site.service.state}</p><h1 id="home-title">{content.headingLine1}<br /><span className="family-word">{content.headingLine2}<svg viewBox="0 0 280 18" aria-hidden="true"><path d="M5 12 Q130 -4 275 9" /></svg></span></h1><p>{content.descriptionLine1}<br />{content.descriptionLine2}</p><div className="hero-actions"><Action /><SiteLink href="/about-us/who-we-are" className="text-link">Get to know us <ArrowUpRight size={17} /></SiteLink></div></div>
        <div className="hero-album" aria-label="Our church family">
          <svg className="hero-house-outline" viewBox="0 0 600 560" fill="none" aria-hidden="true"><path d="M40 250 300 30 560 250V530H40Z" /></svg>
          <figure className="hero-photo hero-photo-main"><img src={content.mainPhoto} width="1000" height="667" alt={content.mainPhotoAlt} fetchPriority="high" /><figcaption>Room for you. Life together.</figcaption></figure>
          <figure className="hero-photo hero-photo-near"><img src={content.nearPhoto} width="1000" height="750" alt={content.nearPhotoAlt} fetchPriority="high" /></figure>
          <div className="hero-note"><Heart size={17} strokeWidth={1.5} /><span>More than a Sunday.<br />A family.</span></div>
        </div>
      </div>
    </section>)
}
