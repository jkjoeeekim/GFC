import { ArrowUpRight, MapPin } from 'lucide-react'
import type { ChurchContent } from '../../content/useContent'
import { titleCase } from '../../lib/format'

export function HouseChurchCard({ church, contactEmail }: { church: ChurchContent['churches'][number]; contactEmail: string }) {
  return <article className="church-entry"><img src={church.image} alt={titleCase(church.leader)} width="1000" height="750" loading="lazy" /><div className="church-entry-body"><p className="church-stage">{church.stage}</p><h3>{titleCase(church.name.replace(' HOUSE CHURCH', ''))}</h3><p className="church-leader">{titleCase(church.leader)}</p><p className="church-area"><MapPin size={15} />{titleCase(church.area)}</p><a className="text-link" href={`mailto:${contactEmail}?subject=${encodeURIComponent('House church connection: ' + titleCase(church.name))}`} aria-label={`Email to connect with ${titleCase(church.name)}`}>Email to connect <ArrowUpRight size={17} /></a></div></article>
}
