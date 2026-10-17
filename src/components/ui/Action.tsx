import type { PropsWithChildren } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { SiteLink } from '../SiteLink'

export function Action({ href = '/house-church', children = 'Find a house church', light = false, className = '' }: PropsWithChildren<{ href?: string; light?: boolean; className?: string }>) {
  return <SiteLink href={href} className={`button ${light ? 'button-light' : ''} ${className}`}>{children}<ArrowUpRight size={18} /></SiteLink>
}
