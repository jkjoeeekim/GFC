import { ArrowUpRight } from 'lucide-react'
import { SiteLink } from '../../components/SiteLink'
import { useChurchContent } from '../../content/useContent'

export function Mission() {
  const core = useChurchContent()
  return (<section className="mission-section container" data-sc-act="flow"><div className="mission-heading" data-sc-in><span className="section-label">Our heart</span><h2>To know God.<br />To make Him known.</h2></div><div className="mission-prose" data-sc-in><p className="large-body">We exist to help people become fully devoted followers of Christ.</p><p>{core.mission}</p><SiteLink href="/about-us/who-we-are" className="text-link">Our story & mission <ArrowUpRight size={17} /></SiteLink></div></section>)
}
