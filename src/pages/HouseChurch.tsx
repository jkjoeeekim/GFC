import { HouseChurchCard } from '../components/house-church/HouseChurchCard'
import { titleCase } from '../lib/format'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Mail, Search, X } from 'lucide-react'
import { MotionPage, PageIntro } from '../components/shared'
import { useChurchContent, useSiteContent } from '../content/useContent'

const stages = [ ['all', 'All life stages'], ['adults', 'Young adults & married couples'], ['college', 'College'], ['youth', 'Youth'] ]
const stageNames: Record<string, string> = { adults: 'Young adults & married couples', college: 'College', youth: 'Youth' }


export default function HouseChurch() {
  const core = useChurchContent()
  const site = useSiteContent()
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [area, setArea] = useState('all')
  const selected = params.get('stage') || 'all'
  const stage = stageNames[selected]
  const churches = core.churches.filter(church => (!stage || church.stage === stage) && (area === 'all' || church.area.toLowerCase() === area) && `${church.name} ${church.area} ${church.leader} ${church.stage}`.toLowerCase().includes(search.toLowerCase()))
  const areas = Array.from(new Set(core.churches.map(c => c.area.toLowerCase())))
  function clear() { setParams({}); setSearch(''); setArea('all') }
  return <MotionPage className="house-page"><PageIntro label="House church" title="A place at the table. A people to call family." description="Faith grows through life together. Find a community for your season of life." />
    <section className="house-intro container" data-sc-act="flow"><div className="house-intro-photo"><img src="/images/house-church-1.webp" alt="GFC house church members sharing a meal in a home" width="1000" height="750" /><span>{site.home.community.meetingDays} · In our homes</span></div><div className="prose"><h2>What is house church?</h2><p>{core.houseChurch[0]}</p><p>{core.houseChurch[1].replace('Every Wednesdays and Fridays,', `Every ${site.home.community.meetingDays},`)}</p></div></section>
    <section className="directory-section container" id="find-community"><div className="directory-heading"><div><span className="section-label">Meet our house church shepherds</span><h2>Find your people.</h2></div><p>You don’t have to figure it out alone.<br />We’d love to help you connect.</p></div>
      <div className="directory-filters"><div className="filter-tabs" role="group" aria-label="Filter by life stage">{stages.map(([value, label]) => <button key={value} aria-pressed={selected === value || (!stage && value === 'all')} onClick={() => { const next = new URLSearchParams(params); if (value === 'all') next.delete('stage'); else next.set('stage', value); setParams(next, { replace: true }) }}>{label}</button>)}</div><div className="search-row"><label className="search-field"><Search size={18} /><span className="sr-only">Search house churches, shepherds, or locations</span><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or location" /></label><label className="select-field"><span className="sr-only">Filter by meeting area</span><select value={area} onChange={e => setArea(e.target.value)}><option value="all">All meeting areas</option>{areas.map(a => <option key={a} value={a}>{titleCase(a)}</option>)}</select></label></div></div>
      <div className="results-status"><p role="status">{churches.length} {churches.length === 1 ? 'house church' : 'house churches'}{stage ? ` · ${stage}` : ''}</p>{(selected !== 'all' || search || area !== 'all') && <button className="text-link" onClick={clear}>Clear filters <X size={14} /></button>}</div>
      <div className="church-directory">{churches.map(church => <HouseChurchCard key={church.id} church={church} contactEmail={site.contactEmail} />)}</div>
      {churches.length === 0 && <div className="empty-results"><h3>No matching house churches.</h3><p>Try another name, location, or life stage.</p><button className="button" onClick={clear}>Clear filters</button></div>}
    </section>
    <section className="house-contact"><div className="container"><Mail size={30} strokeWidth={1.2} /><h2>Not sure where to start?</h2><p>{core.houseChurch[2].replace('gfchousechurches@gmail.com', site.contactEmail)}</p><a className="button" href={`mailto:${site.contactEmail}`}>Email to connect <ArrowUpRight size={18} /></a><span className="email-address">{site.contactEmail}</span></div></section>
  </MotionPage>
}
