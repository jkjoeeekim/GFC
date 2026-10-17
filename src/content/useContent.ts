import { createContext, useContext } from 'react'
import defaultSite from './site.json'
import defaultChurch from '../data/core.json'
import type gallery from '../data/gallery.json'
import type sermons from '../data/sermons.json'
import type { Sermon } from './mediaTypes'

export type SiteContent = typeof defaultSite
export type ChurchContent = typeof defaultChurch
export type GalleryContent = typeof gallery
export type SermonContent = typeof sermons
export type ChurchEvent = { id: string; title: string; startsAt: string; timeZone?: string; description: string; location?: string; href?: string }
export type ContentOverrides = {
  site?: SiteContent
  church?: ChurchContent
  gallery?: GalleryContent
  sermons?: SermonContent
  events?: ChurchEvent[]
}

type ContentValue = ContentOverrides & { site: SiteContent; church: ChurchContent }
export const ContentContext = createContext<ContentValue>({ site: defaultSite, church: defaultChurch })

export function useSiteContent() { return useContext(ContentContext).site }
export function useChurchContent() { return useContext(ContentContext).church }
export function useGalleryContent(fallback: GalleryContent) { return useContext(ContentContext).gallery || fallback }
export function useSermonContent(fallback: SermonContent) { return useContext(ContentContext).sermons || fallback }
export function useLatestSermonContent(fallback: Sermon): Sermon { return useContext(ContentContext).sermons?.sermons.find(s => s.series.includes('recent-sermons')) || fallback }
const noEvents: ChurchEvent[] = []
export function useEventsContent() { return useContext(ContentContext).events || noEvents }
export { defaultSite, defaultChurch }
