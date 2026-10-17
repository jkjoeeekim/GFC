import { MotionPage, PageIntro } from '../components/shared'
import { AboutNav } from '../components/layout/AboutNav'
import { ConnectBand } from '../components/shared'
import { useChurchContent } from '../content/useContent'

export function Beliefs() {
  const core = useChurchContent()
  return <MotionPage><PageIntro label="Our core beliefs" title="Rooted in the truth of God’s Word." description="GFC Doctrinal" /><AboutNav /><section className="belief-section container"><div className="belief-label"><h2>Primary doctrines</h2><p>The foundations of our faith.</p></div><div className="belief-list">{core.beliefs.filter(b => b.number < 8).map(b => <details key={b.number} open={b.number === 1}><summary><span>{b.title}</span><span className="detail-toggle" aria-hidden="true">+</span></summary><ul>{b.points.map(p => <li key={p}>{p}</li>)}</ul></details>)}</div></section><section className="belief-section container"><div className="belief-label"><h2>Secondary doctrines</h2><p>{core.secondaryIntro}</p></div><div className="belief-list">{core.beliefs.filter(b => b.number >= 8).map(b => <details key={b.number}><summary><span>{b.title}</span><span className="detail-toggle" aria-hidden="true">+</span></summary><ul>{b.points.map(p => <li key={p}>{p}</li>)}</ul></details>)}</div></section><ConnectBand /></MotionPage>
}
