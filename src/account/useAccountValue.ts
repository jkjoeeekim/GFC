import { useCallback, useEffect, useMemo, useState } from 'react'
import { accountsEnabled } from '../backend/config'
import { createAccount, getAccount, listAccounts, updateAccountAccess, updateAccountName } from '../backend/accounts'
import { sendSignInCode, signOutUser, watchSignedInUser } from '../backend/auth'
import { savePublishedSitePatch } from '../backend/siteContent'
import type { SitePatch } from '../backend/siteContent'
import { publishedSite } from '../content/publishedSite'
import type { Account, AccountStatus, AuthState, Role } from './types'

const name = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > 80) throw new Error('Enter your name (up to 80 characters).')
  return trimmed
}

export function useAccountValue() {
  const [state, setState] = useState<AuthState>(accountsEnabled ? { status: 'loading' } : { status: 'unavailable' })

  const resolve = useCallback(async (user: { uid: string; phone: string } | null) => {
    if (!user) return setState({ status: 'signed-out' })
    try {
      const account = await getAccount(user.uid)
      if (!account) setState({ status: 'needs-profile', ...user })
      else setState(account.status === 'active' ? { status: 'active', account } : { status: 'removed', account })
    } catch (error) {
      setState({ status: 'error', message: (error as Error).message })
    }
  }, [])

  useEffect(() => accountsEnabled ? watchSignedInUser(resolve) : undefined, [resolve])

  const current = state.status === 'active' ? state.account : null
  const requireAdmin = useCallback(() => {
    if (current?.role !== 'admin') throw new Error('Only admins can do that.')
    return current
  }, [current])

  return useMemo(() => ({
    state,
    sendCode: sendSignInCode,
    signOut: signOutUser,
    async createProfile(value: string) {
      if (state.status !== 'needs-profile') return
      await createAccount(state.uid, state.phone, name(value))
      await resolve({ uid: state.uid, phone: state.phone })
    },
    async updateName(value: string) {
      if (!current) return
      const next = name(value)
      await updateAccountName(current.uid, next)
      setState({ status: 'active', account: { ...current, name: next } })
    },
    listAccounts: () => { requireAdmin(); return listAccounts() },
    async setAccess(account: Account, access: { role?: Role; status?: AccountStatus }) {
      if (requireAdmin().uid === account.uid) throw new Error('Ask another admin to change your own access.')
      await updateAccountAccess(account.uid, access)
    },
    async publishSite(patch: SitePatch) {
      await savePublishedSitePatch(patch, requireAdmin().uid)
      publishedSite.set(patch)
    },
  }), [state, current, resolve, requireAdmin])
}
