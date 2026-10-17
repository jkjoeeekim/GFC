import { SiteLink } from '../SiteLink'

export function Brand() {
  return <SiteLink href="/" className="brand" aria-label="God’s Family Church home">
    <span className="brand-mark"><img src="/images/logo.webp" alt="" width="44" height="44" /></span>
    <span>God’s Family<span className="brand-second">Church</span></span>
  </SiteLink>
}
