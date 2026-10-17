import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import { SiteLink } from '../SiteLink'
import { Brand } from './Brand'
import { navLinks, aboutLinks } from '../../content/navigation'

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const header = useRef<HTMLElement>(null)
  useEffect(() => {
    function close(event: KeyboardEvent | MouseEvent) {
      if ((event instanceof KeyboardEvent && event.key === 'Escape') ||
        (event instanceof MouseEvent && !event.composedPath().includes(header.current as EventTarget))) {
        if (event instanceof KeyboardEvent) {
          const trigger = header.current?.querySelector<HTMLElement>('[aria-expanded="true"], details[open] summary')
          trigger?.focus()
        }
        setOpen(false)
        header.current?.querySelector('details')?.removeAttribute('open')
      }
    }
    document.addEventListener('keydown', close)
    document.addEventListener('click', close)
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('click', close) }
  }, [])
  return <header id="header" ref={header} className="site-header" onClick={(event) => {
    if ((event.target as HTMLElement).closest('a')) {
      setOpen(false)
      header.current?.querySelector('details')?.removeAttribute('open')
    }
  }}>
    <div className="header-inner">
      <Brand />
      <nav aria-label="Main navigation" className="desktop-nav">
        <details className="about-menu"><summary>About Us <ChevronDown size={13} /></summary>
          <div className="about-dropdown">{aboutLinks.map(([label, href]) => <SiteLink href={href} key={href}>{label}</SiteLink>)}</div>
        </details>
        {navLinks.map(([label, href]) => <SiteLink key={href} href={href} aria-current={location.pathname === href ? 'page' : undefined}>{label}</SiteLink>)}
      </nav>
      <SiteLink href="/house-church" className="button button-small header-cta">Find a house church <ArrowUpRight size={15} /></SiteLink>
      <button className="icon-button menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
      <SiteLink href="/">Home</SiteLink>
      {[...aboutLinks, ...navLinks].map(([label, href]) => <SiteLink href={href} key={href}>{label}<ArrowUpRight size={16} /></SiteLink>)}
    </nav>}
  </header>
}
