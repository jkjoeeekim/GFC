import { MotionPage, PageIntro } from '../components/shared'
import { AboutNav } from '../components/layout/AboutNav'
import { ArrowUpRight } from 'lucide-react'
import { SiteLink } from '../components/SiteLink'
import { MapPin } from 'lucide-react'
import { Action, VisitDetails } from '../components/shared'
import { useChurchContent, useSiteContent } from '../content/useContent'

export function WhoWeAre() {
  const core = useChurchContent()
  const site = useSiteContent()
  const service = site.service
  return <MotionPage><PageIntro label="God’s Family Church" title="A church. A community. A family." description="We exist to know God and make Him known." /><AboutNav />
    <section className="about-story container" data-sc-act="flow"><div className="story-photo"><img src="/images/home-1.webp" alt="GFC house church members gathered together outside a home" width="1000" height="667" /></div><div className="prose"><h2>Who we are</h2>{core.who.slice(0, 2).map(p => <p key={p}>{p}</p>)}<Action /></div></section>
    <section className="scripture-section container"><img src="/images/home-2.webp" alt="Matthew 28: Go and make disciples of all nations, baptizing them in the name of the Father, the Son, and the Holy Spirit, and teaching them to obey everything I have commanded you" width="1000" height="667" loading="lazy" /><div><span className="section-label">Our mission</span><h2>Fully devoted<br />followers of Christ.</h2><p>{core.mission}</p><SiteLink className="text-link" href="/about-us/our-core-values">Our core beliefs <ArrowUpRight size={17} /></SiteLink></div></section>
    <section className="location-section"><div className="container location-grid"><div><h2>Come check us out.</h2><p>Join our English-Speaking Congregation for service in {service.room.toLowerCase()}.</p><VisitDetails /><Action /></div><div className="location-plate"><MapPin size={38} strokeWidth={1.2} /><h3>God’s Family Church</h3><p>{service.addressLine}<br />{service.city}, {service.state} {service.postalCode}</p><span>{service.day} · {service.time}</span></div></div></section>
  </MotionPage>
}
