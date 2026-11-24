import { useState } from 'react'
import { useAccount } from '../../account/useAccount'
import { formatPhone } from '../../account/phone'
import type { Account } from '../../account/types'
import { runAction } from '../../account/runAction'
import { FormField, FormMessage } from './FormField'

export function ProfileDetails({ account }: { account: Account }) {
  const { updateName } = useAccount()
  const [name, setName] = useState(account.name)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  return <form className="account-panel" onSubmit={event => {
    event.preventDefault()
    setSaved('')
    runAction(setBusy, setError, async () => { await updateName(name); setSaved('Your name is saved.') })
  }}>
    <h2>Your details</h2>
    <dl className="account-facts">
      <div><dt>Phone</dt><dd>{formatPhone(account.phone)}</dd></div>
      <div><dt>Account</dt><dd><span className={`role-badge role-${account.role}`}>{account.role === 'admin' ? 'Admin' : 'Member'}</span></dd></div>
    </dl>
    <FormField id="profile-name" label="Name"><input id="profile-name" value={name} onChange={e => { setName(e.target.value); setSaved('') }} autoComplete="name" maxLength={80} required /></FormField>
    <FormMessage error={error} success={saved} />
    <button className="button" disabled={busy || name.trim() === account.name}>{busy ? 'Saving…' : 'Save name'}</button>
  </form>
}
