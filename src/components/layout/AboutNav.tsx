import { useLocation } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { SiteLink } from '../SiteLink'

export function AboutNav() {
  const { pathname } = useLocation()
  return <nav className="about-page-nav container" aria-label="About us pages">{[['Who We Are', '/about-us/who-we-are'], ['Meet Our Staff', '/about-us/meet-our-staff'], ['Our Core Beliefs', '/about-us/our-core-values']].map(([name, path]) => <SiteLink key={path} href={path} aria-current={pathname === path || (pathname === '/who-we-are' && path.endsWith('who-we-are')) ? 'page' : undefined}>{name}<ArrowUpRight size={15} /></SiteLink>)}</nav>
}

