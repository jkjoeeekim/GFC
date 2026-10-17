import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { ContentProvider } from './content/ContentProvider'
import { useSiteContent } from './content/useContent'
import type { ContentOverrides } from './content/useContent'
import './App.css'

const Pages = lazy(() => import('./pages/Pages'))
const HouseChurch = lazy(() => import('./pages/HouseChurch'))
const Sermons = lazy(() => import('./pages/Sermons'))
const Gallery = lazy(() => import('./pages/Gallery'))

function Site() {
  const { service } = useSiteContent()
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const title: Record<string, string> = { '/': 'A place to grow together', '/house-church': 'House Church', '/gallery': 'Gallery', '/listen': 'Listen', '/events': 'Events', '/give': 'Give', '/about-us/who-we-are': 'Who We Are', '/who-we-are': 'Who We Are', '/joseph': 'Joseph sermons', '/about-us/meet-our-staff': 'Meet Our Staff', '/about-us/our-core-values': 'Our Core Beliefs' }
    document.title = `${title[location.pathname] || (location.pathname.startsWith('/listen/') ? 'Sermon archive' : 'Page not found')} | God’s Family Church`
    document.querySelector('meta[name=description]')?.setAttribute('content', `God’s Family Church in ${service.city}, ${service.state}. Find a house church, grow in faith, and join our English-Speaking Congregation ${service.day.toLowerCase()} at ${service.time}.`)
  }, [location.pathname, service])
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header />
    <Suspense fallback={<main id="main-content" className="container page-loading" aria-busy="true"><p>Loading this part of our story…</p></main>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/house-church" element={<HouseChurch />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/listen/*" element={<Sermons />} />
        <Route path="/joseph" element={<Sermons alias="joseph" />} />
        <Route path="*" element={<Pages />} />
      </Routes>
    </Suspense>
    <Footer /></>
}
export default function App({ content }: { content?: ContentOverrides }) { return <ContentProvider value={content}><BrowserRouter><Site /></BrowserRouter></ContentProvider> }
