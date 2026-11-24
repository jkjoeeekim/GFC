import { createContext, useContext } from 'react'
import type { useAccountValue } from './useAccountValue'

export type AccountValue = ReturnType<typeof useAccountValue>
export const AccountContext = createContext<AccountValue | null>(null)

/** The signed-in person and every account/admin action. Only available inside `AccountProvider`. */
export function useAccount() {
  const value = useContext(AccountContext)
  if (!value) throw new Error('useAccount must be used inside AccountProvider')
  return value
}
