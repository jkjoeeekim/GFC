import { MotionPage, PageIntro } from '../components/shared'
import { ArrowUpRight } from 'lucide-react'
import { ConnectBand } from '../components/shared'
import { useChurchContent, useSiteContent } from '../content/useContent'

export function Give() {
  const core = useChurchContent()
  const site = useSiteContent()
  return <MotionPage><PageIntro label="Give" title="Help give to advance the Kingdom!" /><section className="give-section container"><figure className="giving-instructions"><a href="https://images.squarespace-cdn.com/content/v1/56a3b643fb36b138610b006f/820dd2c7-c74b-4ba2-b1f5-5989d2a77eee/GFC+Announcements+and+Slides.jpg" target="_blank" rel="noreferrer" aria-label="View original giving instructions and Zelle QR code at full size"><img src="/images/give.webp" alt="Four ways to give: app, text at 1-877-525-5921, Zelle using the QR code, and in person" width="1200" height="675" /></a><figcaption>Give through the app, text 1-877-525-5921, use the Zelle QR code above, or give in person. Select the image to view the original instructions at full size.</figcaption></figure><div className="prose"><h2>Your generosity<br />serves the mission.</h2><p>{core.give}</p><a href={site.links.giving} className="button" target="_blank" rel="noreferrer">Give via Tithe.ly <ArrowUpRight size={18} /></a><p className="fine-print">Online giving opens securely on Tithe.ly.</p></div></section><ConnectBand /></MotionPage>
}
