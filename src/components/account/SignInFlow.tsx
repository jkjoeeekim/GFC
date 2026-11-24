import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useAccount } from '../../account/useAccount'
import { formatPhone, toE164 } from '../../account/phone'
import type { ConfirmCode } from '../../account/types'
import { runAction } from '../../account/runAction'
import { FormField, FormMessage } from './FormField'

/** Phone number → text-message code → name (first sign-in only). */
export function SignInFlow() {
  const { state, sendCode, createProfile } = useAccount()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [sent, setSent] = useState<{ to: string; confirm: ConfirmCode } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const recaptcha = useRef<HTMLDivElement>(null)

  function requestCode(event?: FormEvent) {
    event?.preventDefault()
    const to = toE164(phone)
    if (!to) return setError('Enter a valid phone number, including the area code.')
    runAction(setBusy, setError, async () => {
      setSent({ to, confirm: await sendCode(to, recaptcha.current!) })
      setCode('')
    })
  }

  if (state.status === 'needs-profile') return <form className="account-panel" onSubmit={event => { event.preventDefault(); runAction(setBusy, setError, () => createProfile(name)) }}>
    <h2>Welcome! What’s your name?</h2>
    <p className="account-lead">You’re signing up with {formatPhone(state.phone)}.</p>
    <FormField id="account-name" label="Your name"><input id="account-name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" maxLength={80} required /></FormField>
    <FormMessage error={error} />
    <button className="button" disabled={busy}>{busy ? 'Creating your account…' : 'Create account'}</button>
  </form>

  if (sent) return <form className="account-panel" onSubmit={event => { event.preventDefault(); runAction(setBusy, setError, () => sent.confirm(code.trim())) }}>
    <h2>Enter your code.</h2>
    <p className="account-lead">We texted a 6-digit code to {formatPhone(sent.to)}.</p>
    <FormField id="sign-in-code" label="Code"><input id="sign-in-code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required autoFocus /></FormField>
    <FormMessage error={error} />
    <button className="button" disabled={busy || code.length !== 6}>{busy ? 'Checking…' : 'Sign in'}</button>
    <div className="account-secondary-actions">
      <button type="button" className="text-button" onClick={() => requestCode()} disabled={busy}>Send a new code</button>
      <button type="button" className="text-button" onClick={() => { setSent(null); setError('') }} disabled={busy}>Use a different number</button>
    </div>
    <div ref={recaptcha} />
  </form>

  return <form className="account-panel" onSubmit={requestCode}>
    <h2>Sign in with your phone.</h2>
    <p className="account-lead">We’ll text you a code. New here? The same steps create your account.</p>
    <FormField id="sign-in-phone" label="Mobile number" hint="US numbers can be typed as (714) 555-0123. For other countries, start with + and the country code."><input id="sign-in-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" aria-describedby="sign-in-phone-hint" required /></FormField>
    <FormMessage error={error} />
    <button className="button" disabled={busy}>{busy ? 'Sending…' : 'Text me a code'}</button>
    <p className="form-hint">Message and data rates may apply.</p>
    <div ref={recaptcha} />
  </form>
}
