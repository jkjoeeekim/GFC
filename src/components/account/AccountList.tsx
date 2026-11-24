import { useCallback, useEffect, useState } from 'react'
import { useAccount } from '../../account/useAccount'
import { formatPhone } from '../../account/phone'
import type { Account, AccountStatus, Role } from '../../account/types'
import { FormMessage } from './FormField'

/** Admin list of everyone with an account, with promote, demote, remove, and restore. */
export function AccountList({ currentUid }: { currentUid: string }) {
  const { listAccounts, setAccess } = useAccount()
  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [pending, setPending] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(() => { listAccounts().then(setAccounts, (e: Error) => setError(e.message)) }, [listAccounts])
  useEffect(load, [load])

  async function change(account: Account, access: { role?: Role; status?: AccountStatus }, question?: string) {
    if (question && !window.confirm(question)) return
    setPending(account.uid)
    setError('')
    try {
      await setAccess(account, access)
      setAccounts(list => list && list.map(a => a.uid === account.uid ? { ...a, ...access } : a))
    } catch (e) { setError((e as Error).message) } finally { setPending('') }
  }

  if (!accounts) return error ? <FormMessage error={error} /> : <p className="account-lead">Loading accounts…</p>
  const active = accounts.filter(a => a.status === 'active')
  return <div>
    <p className="account-lead">{active.length} active {active.length === 1 ? 'account' : 'accounts'}, {active.filter(a => a.role === 'admin').length} with admin access.</p>
    <FormMessage error={error} />
    <ul className="account-list">{accounts.map(account => {
      const busy = pending === account.uid
      const label = account.name || formatPhone(account.phone)
      return <li key={account.uid} className={account.status === 'removed' ? 'is-removed' : undefined}>
        <div className="account-who"><strong>{account.name}</strong><span>{formatPhone(account.phone)}</span></div>
        <div className="account-badges">
          <span className={`role-badge role-${account.role}`}>{account.role === 'admin' ? 'Admin' : 'Member'}</span>
          {account.status === 'removed' && <span className="role-badge role-removed">Removed</span>}
        </div>
        <div className="account-actions">{account.uid === currentUid ? <span className="form-hint">This is you</span>
          : account.status === 'removed' ? <button className="button button-small button-outline" disabled={busy} onClick={() => change(account, { status: 'active' })}>Restore</button>
          : <>
            {account.role === 'member'
              ? <button className="button button-small button-outline" disabled={busy} onClick={() => change(account, { role: 'admin' }, `Give ${label} admin access? Admins can edit the website and manage every account.`)}>Make admin</button>
              : <button className="button button-small button-outline" disabled={busy} onClick={() => change(account, { role: 'member' })}>Make member</button>}
            <button className="button button-small button-outline button-danger" disabled={busy} onClick={() => change(account, { status: 'removed', role: 'member' }, `Remove ${label}? They will no longer be able to use their account.`)}>Remove</button>
          </>}
        </div>
      </li>
    })}</ul>
  </div>
}
