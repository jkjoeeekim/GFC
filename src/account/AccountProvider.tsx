import type { PropsWithChildren } from 'react'
import { AccountContext } from './useAccount'
import { useAccountValue } from './useAccountValue'

/** Owns the signed-in person and every account/admin call, so screens stay free of Firebase code. */
export function AccountProvider({ children }: PropsWithChildren) {
  return <AccountContext.Provider value={useAccountValue()}>{children}</AccountContext.Provider>
}
