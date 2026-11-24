import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PublishedApp } from './PublishedApp'
import { loadPublishedSite } from './content/publishedSite'

loadPublishedSite()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PublishedApp />
  </StrictMode>,
)
