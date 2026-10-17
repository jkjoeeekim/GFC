import { ArrowUpRight, MapPin } from 'lucide-react'
import type { ChurchEvent } from '../../content/useContent'
import { SiteLink } from '../SiteLink'

export function EventListing({ event }: { event: ChurchEvent }) {
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short', timeZone: event.timeZone || 'America/Los_Angeles' }).format(new Date(event.startsAt))
  return <article className="event-listing"><time dateTime={event.startsAt}>{date}</time><h2>{event.title}</h2><p>{event.description}</p>{event.location && <p className="event-location"><MapPin size={16} />{event.location}</p>}{event.href && <SiteLink className="text-link" href={event.href}>Event details <ArrowUpRight size={17} /></SiteLink>}</article>
}
