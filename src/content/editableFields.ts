import type { SiteContent } from './useContent'

type FieldDefinition = { path: string; label: string; type: 'text' | 'email' | 'url' | 'image'; maxLength: number }
/** Explicit editing contract for the future portal; styling and navigation structure are excluded. */
export const editableFields: readonly FieldDefinition[] = [
  { path: 'service.day', label: 'Service day', type: 'text', maxLength: 30 },
  { path: 'service.time', label: 'Service time', type: 'text', maxLength: 30 },
  { path: 'service.room', label: 'Service room', type: 'text', maxLength: 80 },
  { path: 'service.addressLine', label: 'Street address', type: 'text', maxLength: 120 },
  { path: 'service.city', label: 'City', type: 'text', maxLength: 80 },
  { path: 'service.state', label: 'State', type: 'text', maxLength: 30 },
  { path: 'service.postalCode', label: 'Postal code', type: 'text', maxLength: 20 },
  { path: 'contactEmail', label: 'Contact email', type: 'email', maxLength: 160 },
  { path: 'links.giving', label: 'Giving destination', type: 'url', maxLength: 500 },
  { path: 'links.koreanCongregation', label: 'Korean congregation website', type: 'url', maxLength: 500 },
  { path: 'home.hero.headingLine1', label: 'Homepage heading, first line', type: 'text', maxLength: 32 },
  { path: 'home.hero.headingLine2', label: 'Homepage heading, second line', type: 'text', maxLength: 32 },
  { path: 'home.hero.descriptionLine1', label: 'Homepage description, first line', type: 'text', maxLength: 90 },
  { path: 'home.hero.descriptionLine2', label: 'Homepage description, second line', type: 'text', maxLength: 90 },
  { path: 'home.hero.mainPhoto', label: 'Homepage primary photograph', type: 'image', maxLength: 500 },
  { path: 'home.hero.mainPhotoAlt', label: 'Primary photograph description', type: 'text', maxLength: 200 },
  { path: 'home.hero.nearPhoto', label: 'Homepage foreground photograph', type: 'image', maxLength: 500 },
  { path: 'home.hero.nearPhotoAlt', label: 'Foreground photograph description', type: 'text', maxLength: 200 },
  { path: 'home.community.headingLine1', label: 'Community heading, first line', type: 'text', maxLength: 45 },
  { path: 'home.community.headingLine2', label: 'Community heading, second line', type: 'text', maxLength: 45 },
  { path: 'home.community.description', label: 'Community introduction', type: 'text', maxLength: 300 },
  { path: 'home.community.meetingDays', label: 'House church meeting days', type: 'text', maxLength: 80 },
  { path: 'home.invitation.headingLine1', label: 'Closing heading, first line', type: 'text', maxLength: 40 },
  { path: 'home.invitation.headingLine2', label: 'Closing heading, second line', type: 'text', maxLength: 40 },
  { path: 'home.invitation.description', label: 'Closing invitation', type: 'text', maxLength: 220 },
]

/** Format validation only. The portal must authorize and validate updates on its server. */
export function applySiteContentPatch(current: SiteContent, patch: Record<string, unknown>): SiteContent {
  const next = structuredClone(current)
  for (const [path, value] of Object.entries(patch)) {
    const field = editableFields.find(f => f.path === path)
    if (!field) throw new Error(`This field cannot be edited: ${path}`)
    if (typeof value !== 'string' || !value.trim() || value.length > field.maxLength) throw new Error(`Invalid value for ${field.label}`)
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error('Enter a valid email address')
    if (field.type === 'url' || field.type === 'image') {
      const localImage = field.type === 'image' && value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')
      if (!localImage) {
        let url: URL
        try { url = new URL(value) } catch { throw new Error(`Enter a valid address for ${field.label}`) }
        if (!['https:', 'http:'].includes(url.protocol)) throw new Error(`Unsupported address for ${field.label}`)
      }
    }
    const keys = path.split('.')
    let target: Record<string, unknown> = next as unknown as Record<string, unknown>
    for (const key of keys.slice(0, -1)) target = target[key] as Record<string, unknown>
    target[keys[keys.length - 1]] = value.trim()
  }
  return next
}
