import { RecaptchaVerifier, connectAuthEmulator, getAuth, onAuthStateChanged, signInWithPhoneNumber, signOut } from 'firebase/auth'
import type { Auth } from 'firebase/auth'
import type { ConfirmCode } from '../account/types'
import { useEmulators } from './config'
import { firebaseApp, friendlyError } from './firestore'

let auth: Auth | undefined
function authentication() {
  if (!auth) {
    auth = getAuth(firebaseApp())
    auth.useDeviceLanguage()
    if (useEmulators) {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
      auth.settings.appVerificationDisabledForTesting = true
    }
  }
  return auth
}

export function watchSignedInUser(listener: (user: { uid: string; phone: string } | null) => void) {
  return onAuthStateChanged(authentication(), user => listener(user ? { uid: user.uid, phone: user.phoneNumber || '' } : null))
}

/** Texts a sign-in code to an E.164 number. `container` hosts Firebase's invisible reCAPTCHA. */
export async function sendSignInCode(phone: string, container: HTMLElement): Promise<ConfirmCode> {
  const verifier = new RecaptchaVerifier(authentication(), container, { size: 'invisible' })
  try {
    const result = await signInWithPhoneNumber(authentication(), phone, verifier)
    return async code => {
      try { await result.confirm(code) } catch (error) { throw friendlyError(error, 'We couldn’t confirm that code. Try again.') }
    }
  } catch (error) {
    throw friendlyError(error, 'We couldn’t send a code to that number. Try again.')
  } finally {
    verifier.clear()
  }
}

export function signOutUser() { return signOut(authentication()) }
