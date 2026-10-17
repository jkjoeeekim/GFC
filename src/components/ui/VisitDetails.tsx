import { Clock3, MapPin } from 'lucide-react'
import { useSiteContent } from '../../content/useContent'

export function VisitDetails({ compact = false }: { compact?: boolean }) {
  const { service } = useSiteContent()
  return <div className={`visit-details ${compact ? 'compact' : ''}`}>
    <div><Clock3 size={20} strokeWidth={1.5} /><p><strong>{service.day} at {service.time}</strong><span>{service.room}</span></p></div>
    <div><MapPin size={20} strokeWidth={1.5} /><p><strong>{service.city}, {service.state}</strong><span>{service.addressLine}, {service.city}, {service.state} {service.postalCode}</span></p></div>
  </div>
}
