import { Navigate } from 'react-router-dom'
import { useAccount } from '../../account/useAccount'
import { MotionPage, PageIntro } from '../../components/shared'
import { SiteLink } from '../../components/SiteLink'
import { AccountNotice, AccountStateNotice } from '../../components/account/AccountNotice'
import { AccountList } from '../../components/account/AccountList'
import { SiteContentEditor } from '../../components/account/SiteContentEditor'

export function Admin() {
  const { state } = useAccount()
  if (state.status === 'signed-out' || state.status === 'needs-profile') return <Navigate to="/account/sign-in" replace />
  const account = state.status === 'active' ? state.account : null
  return <MotionPage><PageIntro label="Admin" title="Church website tools." description="Update the details people see on the website, and choose who has admin access." />
    {!account ? <section className="container account-section"><AccountStateNotice /></section>
      : account.role !== 'admin' ? <section className="container account-section"><AccountNotice title="Admins only."><p>Your account doesn’t have admin access. An existing admin can grant it.</p><SiteLink href="/account" className="text-link">Back to your account</SiteLink></AccountNotice></section>
      : <>
        <section className="container account-section" aria-labelledby="admin-content-heading"><h2 id="admin-content-heading">Website details</h2><SiteContentEditor /></section>
        <section className="container account-section" aria-labelledby="admin-people-heading"><h2 id="admin-people-heading">People</h2><AccountList currentUid={account.uid} /></section>
      </>}
  </MotionPage>
}
