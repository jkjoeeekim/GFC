import { SermonCard } from '../components/sermons/SermonCard'
import { useDeferredValue, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Headphones, Search, X } from 'lucide-react'
import { ConnectBand, MediaDialog, MotionPage, PageIntro } from '../components/shared'
import type { Sermon } from '../components/shared'
import { SiteLink } from '../components/SiteLink'
import defaultData from '../data/sermons.json'
import { useChurchContent, useSermonContent } from '../content/useContent'

const bookSlugs = ['john', '1-corinthians', 'ephesians', 'luke', 'galatians', 'colossians', '1-peter', '1-thessalonians', 'ruth', 'daniel']
const displayTitle = (title: string) => title.toLowerCase().replace(/(^|[ :])\w/g, c => c.toUpperCase()).replace('‘22 Series', '2022 Series')

export default function Sermons({ alias }: { alias?: string }) {
  const core = useChurchContent()
  const data = useSermonContent(defaultData)
  const names = new Map(data.series.map(s => [s.slug, displayTitle(s.title)]))
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const slug = alias || pathname.split('/')[2] || 'all'
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(12)
  const [selected, setSelected] = useState<Sermon | null>(null)
  const query = useDeferredValue(search.toLowerCase())
  const category = slug === 'by-book' || slug === 'topical' || slug === 'sermon-topics'
  const series = data.series.find(s => s.slug === slug)
  const filtered = data.sermons.filter(s => (slug === 'all' || category || s.series.includes(slug)) && `${s.title} ${s.series.map(id => names.get(id)).join(' ')} ${'author' in s ? s.author : ''}`.toLowerCase().includes(query))
  const categorySeries = data.series.filter(s => s.slug !== 'recent-sermons' && (slug === 'sermon-topics' || (slug === 'by-book' ? bookSlugs.includes(s.slug) : !bookSlugs.includes(s.slug) && s.slug !== 'guest-pastors')))
  const originalCategoryHref = (seriesSlug: string) => (data.categoryLinks[slug === 'by-book' ? 'by-book' : 'topical'] || []).find(href => href.endsWith('/' + seriesSlug)) || `/listen/${seriesSlug}`
  const title = category ? (slug === 'by-book' ? 'Explore the Word, book by book.' : 'Teaching for the life we share.') : series ? displayTitle(series.title) : slug === 'all' ? 'Rooted in the Word. Growing in faith.' : 'Sermon series'
  return <MotionPage className="listen-page"><PageIntro label="Listen" title={title} description={series?.description || 'Our Sunday sermons, organized by date, book, and topic. Listen along with God’s Family Church.'} />
    <nav className="archive-nav container" aria-label="Sermon archive categories">{[['All messages', '/listen', 'all'], ['Recent sermons', '/listen/recent-sermons', 'recent-sermons'], ['By book', 'https://www.gfchouse.com/listen/by-book', 'by-book'], ['Topical', 'https://gfchouse.com/listen/topical', 'topical'], ['Guest pastors', '/listen/guest-pastors', 'guest-pastors']].map(([label, href, value]) => <SiteLink key={value} href={href} aria-current={slug === value ? 'page' : undefined} onClick={() => { setSearch(''); setLimit(12) }}>{label}</SiteLink>)}</nav>
    {category ? <section className="series-index container"><div className="index-heading"><h2>{slug === 'by-book' ? 'By book' : 'Sermon topics'}</h2><p>Choose a series to start listening.</p></div><div className="series-list">{categorySeries.map((s, i) => <SiteLink href={originalCategoryHref(s.slug)} className="series-index-item" key={s.slug}><span className="series-index-number">{String(i + 1).padStart(2, '0')}</span><div><h3>{displayTitle(s.title)}</h3><p>{s.count ? `${s.count} ${s.count === 1 ? 'recording' : 'recordings'}` : 'Explore series'}</p></div><ArrowUpRight size={22} /></SiteLink>)}</div></section> : <section className="sermon-library container">{series && !series.count && series.image && <figure className="series-artwork"><img src={series.localImage || series.image} alt={displayTitle(series.title) + ' series artwork'} width="900" height="506" /><figcaption>{series.description}</figcaption></figure>}
      <SiteLink className="text-link archive-all-series" href="/listen/sermon-topics">Browse all series <ArrowUpRight size={15} /></SiteLink><div className="archive-tools"><label className="search-field"><Search size={18} /><span className="sr-only">Search sermon titles, books, or topics</span><input type="search" value={search} placeholder="Search sermons, books, or topics" onChange={e => { setSearch(e.target.value); setLimit(12) }} /></label><label className="select-field"><span className="sr-only">Browse a sermon series</span><select value={series ? slug : ''} onChange={e => { if (e.target.value) { setSearch(''); setLimit(12); navigate(`/listen/${e.target.value}`) } }}><option value="">Browse a series</option>{data.series.filter(s => s.slug !== 'recent-sermons').map(s => <option key={s.slug} value={s.slug}>{displayTitle(s.title)}</option>)}</select></label></div>
      <div className="results-status"><p role="status">{filtered.length} {filtered.length === 1 ? 'recording' : 'recordings'}{query ? ` matching “${search}”` : ''}</p>{search && <button className="text-link" onClick={() => setSearch('')}>Clear search <X size={14} /></button>}</div>
      <div className="sermon-grid">{filtered.slice(0, limit).map(sermon => <SermonCard key={sermon.id} sermon={sermon} seriesTitle={names.get(sermon.series.find(s => s !== 'recent-sermons') || sermon.series[0])} onPlay={() => setSelected(sermon)} />)}</div>
      {filtered.length > limit && <div className="load-more"><button className="button button-outline" onClick={() => setLimit(limit + 12)}>Load more messages <span>({filtered.length - limit} more)</span></button></div>}
      {!filtered.length && <div className="empty-results"><h2>{series && !series.count ? 'This series has no recordings listed.' : 'No matching messages.'}</h2><p>{series && !series.count ? 'Explore another series from the archive.' : 'Try a different title, book, or topic.'}</p>{search ? <button className="button" onClick={() => setSearch('')}>Clear search</button> : <SiteLink className="button" href="/listen">Explore all messages</SiteLink>}</div>}
    </section>}
    <section className="podcast-band"><div className="container"><Headphones size={30} strokeWidth={1.3} /><div><h2>Take the message with you.</h2><p>Listen to God’s Family Church wherever you are.</p></div><div><a href={core.socials[4].href} target="_blank" rel="noreferrer">Spotify <ArrowUpRight size={17} /></a><a href={core.socials[5].href} target="_blank" rel="noreferrer">Apple Podcasts <ArrowUpRight size={17} /></a></div></div></section>
    <MediaDialog sermon={selected} onClose={() => setSelected(null)} /><ConnectBand />
  </MotionPage>
}
