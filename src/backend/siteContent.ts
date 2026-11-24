import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore/lite'
import { database, friendlyError } from './firestore'

/** Published values for `editableFields`, keyed by field path. Fields left out use the site's defaults. */
export type SitePatch = Record<string, string>

const siteDoc = () => doc(database(), 'content', 'site')

export async function loadPublishedSitePatch(): Promise<SitePatch> {
  const snapshot = await getDoc(siteDoc())
  return snapshot.exists() ? snapshot.get('fields') || {} : {}
}

/** Admin only. Replaces the whole published patch. */
export async function savePublishedSitePatch(fields: SitePatch, uid: string) {
  try { await setDoc(siteDoc(), { fields, updatedAt: serverTimestamp(), updatedBy: uid }) } catch (error) { throw friendlyError(error, 'We couldn’t publish those changes.') }
}
