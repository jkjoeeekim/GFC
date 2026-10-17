import { useLocation } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Action, MotionPage, PageIntro } from '../components/shared'
import { SiteLink } from '../components/SiteLink'
import { WhoWeAre } from './WhoWeAre'
import { Staff } from './Staff'
import { Beliefs } from './Beliefs'
import { Events } from './Events'
import { Give } from './Give'

export default function Pages() {
  const { pathname } = useLocation()
  if (pathname === '/about-us/who-we-are' || pathname === '/who-we-are') return <WhoWeAre />
  if (pathname === '/about-us/meet-our-staff') return <Staff />
  if (pathname === '/about-us/our-core-values') return <Beliefs />
  if (pathname === '/events') return <Events />
  if (pathname === '/give') return <Give />
  return <MotionPage><PageIntro title="Let’s find your way." description="This page isn’t part of our site. There’s still plenty to explore." /><div className="container not-found"><Action href="/">Back to home</Action><SiteLink className="text-link" href="/house-church">Find a house church <ArrowUpRight size={18} /></SiteLink></div></MotionPage>
}
