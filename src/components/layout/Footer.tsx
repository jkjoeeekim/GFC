import { ArrowUpRight } from 'lucide-react'
import { SiteLink } from '../SiteLink'
import { Brand } from './Brand'
import { navLinks, aboutLinks } from '../../content/navigation'
import { useChurchContent, useSiteContent } from '../../content/useContent'

export function Footer() {
  const core = useChurchContent()
  const site = useSiteContent()
  const service = site.service
  return <footer className="site-footer">
    <div className="footer-main container">
      <div className="footer-brand"><Brand /><p>We exist to know God<br />and make Him known.</p><a className="text-link subtle-link" href={site.links.koreanCongregation} target="_blank" rel="noreferrer">GFC · Korean-Speaking Congregation <ArrowUpRight size={14} /></a></div>
      <div><h2>Get to know us</h2><div className="footer-links">{aboutLinks.map(([label, href]) => <SiteLink href={href} key={href}>{label}</SiteLink>)}<SiteLink href="/house-church">House Church</SiteLink></div></div>
      <div><h2>Life at GFC</h2><div className="footer-links">{navLinks.slice(1).map(([label, href]) => <SiteLink href={href} key={href}>{label}</SiteLink>)}</div></div>
      <div><h2>Stay connected</h2><div className="footer-links social-links">{core.socials.map(s => <a href={s.href} key={s.label} target="_blank" rel="noreferrer">{s.label}<ArrowUpRight size={13} /></a>)}</div></div>
    </div>
    <div className="footer-bottom container"><p>God’s Family Church · {service.city}, {service.state}</p><p>{service.addressLine}, {service.city}, {service.state} {service.postalCode}</p><a href="#header">Back to top ↑</a></div>
  </footer>
}
