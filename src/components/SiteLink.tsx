import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export function SiteLink({ href = '/', onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const navigate = useNavigate()
  function follow(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || props.target === '_blank' || href.startsWith('#')) return
    const url = new URL(href, window.location.origin)
    if (url.origin === window.location.origin || ['www.gfchouse.com', 'gfchouse.com'].includes(url.hostname)) {
      event.preventDefault()
      navigate(url.pathname + url.search + url.hash)
    }
  }
  const rendered = href.startsWith('/') && !href.startsWith('//') ? import.meta.env.BASE_URL + href.slice(1) : href
  return <a href={rendered} onClick={follow} {...props} />
}
