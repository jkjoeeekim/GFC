import { MotionPage, PageIntro } from '../components/shared'
import { ArrowUpRight } from 'lucide-react'
import { SiteLink } from '../components/SiteLink'
import { ConnectBand } from '../components/shared'
import { CalendarDays } from 'lucide-react'
import { useChurchContent, useEventsContent } from '../content/useContent'
import { EventListing } from '../components/ui/EventListing'

export function Events() {
  const core = useChurchContent()
  const events = useEventsContent()
  return <MotionPage><PageIntro label="Life at GFC" title="More moments together." description="Upcoming events" /><div className="container events-layout"><img src="/images/gallery-35.webp" alt="Church friends enjoying time together outdoors" width="1000" height="667" />{events.length ? <div className="event-list">{events.map(event => <EventListing key={event.id} event={event} />)}</div> : <div className="events-empty"><CalendarDays size={36} strokeWidth={1.3} /><h2>Stay connected.</h2><p>No upcoming events are listed right now. Follow GFC on Instagram for more from our church family.</p><a className="text-link" href={core.socials[3].href} target="_blank" rel="noreferrer">GFC on Instagram <ArrowUpRight size={17} /></a><SiteLink className="text-link" href="/gallery">See our shared memories <ArrowUpRight size={17} /></SiteLink></div>}</div><ConnectBand /></MotionPage>
}
