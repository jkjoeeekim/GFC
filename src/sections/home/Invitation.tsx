import { Action, VisitDetails } from '../../components/shared'
import { useSiteContent } from '../../content/useContent'
import { ArrowUpRight } from 'lucide-react'
import { SiteLink } from '../../components/SiteLink'

export function Invitation() {
  const site = useSiteContent()
  const content = site.home.invitation
  return (<section className="home-close" data-sc-act="flow"><div className="container close-grid"><div><span className="section-label">Your next step starts here</span><h2>{content.headingLine1}<br />{content.headingLine2}</h2><p>{content.description}</p><Action light /><a className="close-email" href={`mailto:${site.contactEmail}`}>{site.contactEmail} <ArrowUpRight size={15} /></a></div><div className="close-visit"><h3>Join us for worship.</h3><VisitDetails /><SiteLink href="/who-we-are" className="text-link">Come check us out <ArrowUpRight size={17} /></SiteLink></div></div></section>)
}
