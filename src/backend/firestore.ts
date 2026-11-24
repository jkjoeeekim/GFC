import { getApps, initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore/lite'
import type { Firestore } from 'firebase/firestore/lite'
import { firebaseConfig, useEmulators } from './config'

export function firebaseApp() { return getApps()[0] ?? initializeApp(firebaseConfig) }

let db: Firestore | undefined
/** Firestore Lite keeps the public bundle small; the site only needs one-off reads and writes. */
export function database() {
  if (!db) {
    db = getFirestore(firebaseApp())
    if (useEmulators) connectFirestoreEmulator(db, '127.0.0.1', 8080)
  }
  return db
}

/** Turns SDK failures into messages a visitor can act on. */
export function friendlyError(error: unknown, fallback: string) {
  const code = (error as { code?: string })?.code || ''
  const messages: Record<string, string> = {
    'permission-denied': 'You don’t have permission to do that.',
    'unavailable': 'We couldn’t reach the server. Check your connection and try again.',
    'auth/invalid-phone-number': 'Enter a valid phone number, including the area code.',
    'auth/missing-phone-number': 'Enter your phone number.',
    'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
    'auth/quota-exceeded': 'We can’t send more codes right now. Please try again later.',
    'auth/invalid-verification-code': 'That code isn’t right. Check the text message and try again.',
    'auth/code-expired': 'That code has expired. Request a new one.',
    'auth/captcha-check-failed': 'We couldn’t confirm you’re a person. Refresh the page and try again.',
    'auth/network-request-failed': 'We couldn’t reach the server. Check your connection and try again.',
  }
  return new Error(messages[code] || fallback)
}
