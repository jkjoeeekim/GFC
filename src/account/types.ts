export type Role = 'member' | 'admin'
export type AccountStatus = 'active' | 'removed'

/** A person's profile, keyed by their Firebase user id and tied to the phone number they signed in with. */
export type Account = { uid: string; phone: string; name: string; role: Role; status: AccountStatus }

export type AuthState =
  | { status: 'unavailable' }
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'needs-profile'; uid: string; phone: string }
  | { status: 'removed'; account: Account }
  | { status: 'active'; account: Account }
  | { status: 'error'; message: string }

/** Confirms the text-message code from a sign-in attempt. */
export type ConfirmCode = (code: string) => Promise<void>
