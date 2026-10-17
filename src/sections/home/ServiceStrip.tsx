import { ArrowUpRight } from 'lucide-react'
import { SiteLink } from '../../components/SiteLink'
import { useSiteContent } from '../../content/useContent'

export function ServiceStrip() {
  const { service } = useSiteContent()
  return (<div className="sunday-strip"><div className="container sunday-inner"><span><span className="status-dot" />Come as you are. Join us for worship.</span><span><strong>{service.day} · {service.time}</strong><span className="strip-divider" />{service.addressLine}, {service.city}</span><SiteLink href="/about-us/who-we-are" className="text-link">Come check us out <ArrowUpRight size={16} /></SiteLink></div></div>)
}
