import type { PropsWithChildren } from 'react'
import { useAccount } from '../../account/useAccount'

export function AccountNotice({ title, children }: PropsWithChildren<{ title: string }>) {
  return <div className="account-panel account-notice" role="status"><h2>{title}</h2>{children}</div>
}

/** The shared screen for states where no account page can be shown, or null when an account page can render. */
export function AccountStateNotice() {
  const { state, signOut } = useAccount()
  if (state.status === 'unavailable') return <AccountNotice title="Accounts aren’t available yet."><p>Sign-in hasn’t been set up for this website.</p></AccountNotice>
  if (state.status === 'loading') return <AccountNotice title="Checking your account…" />
  if (state.status === 'error') return <AccountNotice title="Something went wrong."><p>{state.message}</p><button className="button button-outline" onClick={() => window.location.reload()}>Try again</button></AccountNotice>
  if (state.status === 'removed') return <AccountNotice title="This account has been removed."><p>If you think this is a mistake, please contact the church.</p><button className="button button-outline" onClick={() => signOut()}>Sign out</button></AccountNotice>
  return null
}
