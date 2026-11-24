import { useMemo, useSyncExternalStore } from 'react'
import App from './App'
import { publishedSite } from './content/publishedSite'

/** Renders local defaults immediately, then the admin-published site settings once they load. */
export function PublishedApp() {
  const site = useSyncExternalStore(publishedSite.subscribe, publishedSite.get)
  const content = useMemo(() => ({ site }), [site])
  return <App content={content} />
}
