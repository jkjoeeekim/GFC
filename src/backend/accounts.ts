import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore/lite'
import type { DocumentData } from 'firebase/firestore/lite'
import type { Account, AccountStatus, Role } from '../account/types'
import { database, friendlyError } from './firestore'

const users = () => collection(database(), 'users')
const toAccount = (uid: string, data: DocumentData): Account => ({ uid, phone: data.phone, name: data.name, role: data.role, status: data.status })

export async function getAccount(uid: string) {
  try {
    const snapshot = await getDoc(doc(users(), uid))
    return snapshot.exists() ? toAccount(uid, snapshot.data()) : null
  } catch (error) { throw friendlyError(error, 'We couldn’t load your account.') }
}

/** New accounts are always active members; `firestore.rules` rejects anything else. */
export async function createAccount(uid: string, phone: string, name: string) {
  try {
    await setDoc(doc(users(), uid), { phone, name, role: 'member', status: 'active', createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  } catch (error) { throw friendlyError(error, 'We couldn’t create your account.') }
}

export async function updateAccountName(uid: string, name: string) {
  try { await updateDoc(doc(users(), uid), { name, updatedAt: serverTimestamp() }) } catch (error) { throw friendlyError(error, 'We couldn’t save your name.') }
}

/** Admin only. */
export async function listAccounts() {
  try {
    const snapshot = await getDocs(users())
    return snapshot.docs.map(d => toAccount(d.id, d.data())).sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) { throw friendlyError(error, 'We couldn’t load the account list.') }
}

/** Admin only, and never on the admin's own account. */
export async function updateAccountAccess(uid: string, access: { role?: Role; status?: AccountStatus }) {
  try { await updateDoc(doc(users(), uid), { ...access, updatedAt: serverTimestamp() }) } catch (error) { throw friendlyError(error, 'We couldn’t update that account.') }
}
