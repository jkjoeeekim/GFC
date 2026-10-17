import { useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { ContentContext, defaultSite, defaultChurch } from './useContent'
import type { ContentOverrides } from './useContent'

/** Supply validated, published admin data here. Presentation components are backend-independent. */
export function ContentProvider({ children, value }: PropsWithChildren<{ value?: ContentOverrides }>) {
  const resolved = useMemo(() => ({ site: value?.site || defaultSite, church: value?.church || defaultChurch, gallery: value?.gallery, sermons: value?.sermons, events: value?.events }), [value?.site, value?.church, value?.gallery, value?.sermons, value?.events])
  return <ContentContext.Provider value={resolved}>{children}</ContentContext.Provider>
}
