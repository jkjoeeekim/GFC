/** Firebase web settings. These identify the project and are public; access is enforced by `firestore.rules`. */
const env = import.meta.env

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

/** Accounts and published content are off until a Firebase project is configured; the site then uses its local defaults. */
export const accountsEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

/** Local development against `npm run emulators` instead of the real project. */
export const useEmulators = env.VITE_FIREBASE_EMULATORS === 'true'
