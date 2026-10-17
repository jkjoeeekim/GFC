import { MotionPage, PageIntro } from '../components/shared'
import { AboutNav } from '../components/layout/AboutNav'
import { ArrowUpRight } from 'lucide-react'
import { SiteLink } from '../components/SiteLink'
import { ConnectBand } from '../components/shared'
import { useChurchContent } from '../content/useContent'

export function Staff() {
  const core = useChurchContent()
  return <MotionPage><PageIntro label="Meet our staff" title="A heart for God. A heart for people." /><AboutNav /><section className="staff-section container" data-sc-act="flow"><figure><img src="/images/about-us-meet-our-staff-0.webp" alt="Pastor Tim Yu and his wife Paulina outdoors" width="1000" height="750" /></figure><div className="prose"><span className="section-label">Our pastor</span><h2>Pastor Tim<br />& Paulina Yu</h2><p>{core.pastor}</p><SiteLink href="/house-church" className="text-link">Meet our house church shepherds <ArrowUpRight size={18} /></SiteLink></div></section><ConnectBand /></MotionPage>
}
