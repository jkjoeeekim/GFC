import { Navigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useAccount } from '../../account/useAccount'
import { MotionPage, PageIntro } from '../../components/shared'
import { SiteLink } from '../../components/SiteLink'
import { AccountStateNotice } from '../../components/account/AccountNotice'
import { ProfileDetails } from '../../components/account/ProfileDetails'

export function Profile() {
  const { state, signOut } = useAccount()
  if (state.status === 'signed-out' || state.status === 'needs-profile') return <Navigate to="/account/sign-in" replace />
  const account = state.status === 'active' ? state.account : null
  return <MotionPage><PageIntro label="Account" title={account ? `Hi, ${account.name}.` : 'Your account'} />
    <section className="container account-section">{account ? <>
      <ProfileDetails account={account} />
      <div className="account-secondary-actions">
        {account.role === 'admin' && <SiteLink href="/account/admin" className="button button-light">Admin tools <ArrowUpRight size={18} /></SiteLink>}
        <button className="button button-outline" onClick={() => signOut()}>Sign out</button>
      </div>
    </> : <AccountStateNotice />}</section>
  </MotionPage>
}
