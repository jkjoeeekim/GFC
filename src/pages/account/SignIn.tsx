import { Navigate } from 'react-router-dom'
import { useAccount } from '../../account/useAccount'
import { MotionPage, PageIntro } from '../../components/shared'
import { AccountStateNotice } from '../../components/account/AccountNotice'
import { SignInFlow } from '../../components/account/SignInFlow'

export function SignIn() {
  const { state } = useAccount()
  if (state.status === 'active') return <Navigate to="/account" replace />
  return <MotionPage><PageIntro label="Account" title="Welcome." description="Sign in to manage your details. Church admins also use this to update the website." />
    <section className="container account-section">{state.status === 'signed-out' || state.status === 'needs-profile' ? <SignInFlow /> : <AccountStateNotice />}</section>
  </MotionPage>
}
