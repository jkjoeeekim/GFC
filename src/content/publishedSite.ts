import { accountsEnabled } from '../backend/config'
import type { SitePatch } from '../backend/siteContent'
import { applySiteContentPatch, editableFields } from './editableFields'
import { defaultSite } from './useContent'
import type { SiteContent } from './useContent'

// Local image paths are stored root-relative ("/images/…") so the same published
// content works at the domain root and under a subpath build such as /GFC/.
const base = import.meta.env.BASE_URL
const isImage = (path: string) => editableFields.some(f => f.path === path && f.type === 'image')
export function toDisplayValue(path: string, value: string) {
  return base !== '/' && isImage(path) && value.startsWith('/') && !value.startsWith('//') && !value.startsWith(base) ? base + value.slice(1) : value
}
export function toStoredValue(path: string, value: string) {
  return base !== '/' && isImage(path) && value.startsWith(base) ? '/' + value.slice(base.length) : value
}

let site: SiteContent = defaultSite
const listeners = new Set<() => void>()

/** Site settings with the admin-published patch applied, for `useSyncExternalStore`. */
export const publishedSite = {
  get: () => site,
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
  /** Applies a stored patch. A field that fails validation keeps its default rather than breaking the page. */
  set(patch: SitePatch) {
    site = Object.entries(patch).reduce((current, [path, value]) => {
      try { return applySiteContentPatch(current, { [path]: toDisplayValue(path, value) }) } catch (error) {
        console.warn(`Ignoring published value for ${path}:`, error)
        return current
      }
    }, defaultSite)
    listeners.forEach(listener => listener())
  },
}

export async function loadPublishedSite() {
  if (!accountsEnabled) return
  try {
    const { loadPublishedSitePatch } = await import('../backend/siteContent')
    publishedSite.set(await loadPublishedSitePatch())
  } catch (error) {
    console.warn('Published site content is unavailable; showing defaults.', error)
  }
}
