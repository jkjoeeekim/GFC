// Runs against the Firestore emulator: `npm run test:rules`.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { after, before, beforeEach, describe, test } from 'node:test'
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'

const rules = fs.readFileSync('firestore.rules', 'utf8')
const phones = { ana: '+17145550101', ben: '+17145550102', cam: '+17145550103' }
let env

const as = (uid) => env.authenticatedContext(uid, { phone_number: phones[uid] }).firestore()
const anonymous = () => env.unauthenticatedContext().firestore()
const profile = (uid, extra = {}) => ({ phone: phones[uid], name: uid, role: 'member', status: 'active', createdAt: serverTimestamp(), updatedAt: serverTimestamp(), ...extra })
const seed = (data) => env.withSecurityRulesDisabled(async ctx => {
  for (const [path, value] of Object.entries(data)) await setDoc(doc(ctx.firestore(), path), value)
})

before(async () => { env = await initializeTestEnvironment({ projectId: 'demo-gfc', firestore: { rules, host: '127.0.0.1', port: 8080 } }) })
beforeEach(async () => {
  await env.clearFirestore()
  await seed({ 'users/ana': profile('ana', { role: 'admin' }), 'users/ben': profile('ben') })
})
after(() => env.cleanup())

test('rules mirror every editable field and limit', async () => {
  const { editableFields } = await import('../src/content/editableFields.ts')
  for (const { path, type, maxLength } of editableFields) {
    assert.ok(rules.includes(`'${path}'`), `${path} is missing from firestore.rules`)
    if (type === 'text') assert.ok(rules.includes(`textOk(f, '${path}', ${maxLength})`), `${path} needs textOk(…, ${maxLength})`)
    else assert.ok(rules.includes(`${type}Ok(f, '${path}')`), `${path} needs ${type}Ok`)
  }
})

describe('signing up', () => {
  test('a new person can create their own member profile', () => assertSucceeds(setDoc(doc(as('cam'), 'users/cam'), profile('cam'))))
  test('they cannot make themselves an admin', () => assertFails(setDoc(doc(as('cam'), 'users/cam'), profile('cam', { role: 'admin' }))))
  test('the phone must be the one they signed in with', () => assertFails(setDoc(doc(as('cam'), 'users/cam'), profile('cam', { phone: phones.ben }))))
  test('they cannot create someone else’s profile', () => assertFails(setDoc(doc(as('cam'), 'users/dee'), profile('cam'))))
  test('a name is required', () => assertFails(setDoc(doc(as('cam'), 'users/cam'), profile('cam', { name: '  ' }))))
  test('signed-out visitors cannot create profiles', () => assertFails(setDoc(doc(anonymous(), 'users/cam'), profile('cam'))))
  test('an existing or removed profile cannot be recreated', async () => {
    await seed({ 'users/cam': profile('cam', { status: 'removed' }) })
    await assertFails(setDoc(doc(as('cam'), 'users/cam'), profile('cam')))
  })
})

describe('members', () => {
  test('can read and rename themselves', async () => {
    await assertSucceeds(getDoc(doc(as('ben'), 'users/ben')))
    await assertSucceeds(updateDoc(doc(as('ben'), 'users/ben'), { name: 'Benjamin', updatedAt: serverTimestamp() }))
  })
  test('cannot change their own role, status, or phone', async () => {
    await assertFails(updateDoc(doc(as('ben'), 'users/ben'), { role: 'admin', updatedAt: serverTimestamp() }))
    await assertFails(updateDoc(doc(as('ben'), 'users/ben'), { status: 'removed', updatedAt: serverTimestamp() }))
    await assertFails(updateDoc(doc(as('ben'), 'users/ben'), { phone: phones.cam, updatedAt: serverTimestamp() }))
  })
  test('cannot read other people or list accounts', async () => {
    await assertFails(getDoc(doc(as('ben'), 'users/ana')))
    await assertFails(getDocs(collection(as('ben'), 'users')))
  })
  test('cannot delete their profile', () => assertFails(deleteDoc(doc(as('ben'), 'users/ben'))))
  test('removed members cannot rename themselves', async () => {
    await seed({ 'users/ben': profile('ben', { status: 'removed' }) })
    await assertSucceeds(getDoc(doc(as('ben'), 'users/ben')))
    await assertFails(updateDoc(doc(as('ben'), 'users/ben'), { name: 'Ben', updatedAt: serverTimestamp() }))
  })
})

describe('admins', () => {
  test('can list everyone', () => assertSucceeds(getDocs(collection(as('ana'), 'users'))))
  test('can promote, demote, remove, and restore others', async () => {
    const ben = doc(as('ana'), 'users/ben')
    await assertSucceeds(updateDoc(ben, { role: 'admin', updatedAt: serverTimestamp() }))
    await assertSucceeds(updateDoc(ben, { role: 'member', updatedAt: serverTimestamp() }))
    await assertSucceeds(updateDoc(ben, { status: 'removed', updatedAt: serverTimestamp() }))
    await assertSucceeds(updateDoc(ben, { status: 'active', updatedAt: serverTimestamp() }))
  })
  test('cannot set unknown roles or edit other fields', async () => {
    await assertFails(updateDoc(doc(as('ana'), 'users/ben'), { role: 'owner', updatedAt: serverTimestamp() }))
    await assertFails(updateDoc(doc(as('ana'), 'users/ben'), { name: 'Renamed', updatedAt: serverTimestamp() }))
  })
  test('cannot change their own access', () => assertFails(updateDoc(doc(as('ana'), 'users/ana'), { role: 'member', updatedAt: serverTimestamp() })))
  test('lose admin powers once removed', async () => {
    await seed({ 'users/ana': profile('ana', { role: 'admin', status: 'removed' }) })
    await assertFails(getDocs(collection(as('ana'), 'users')))
    await assertFails(updateDoc(doc(as('ana'), 'users/ben'), { role: 'admin', updatedAt: serverTimestamp() }))
  })
})

describe('published site content', () => {
  const publish = (uid, fields, extra = {}) => setDoc(doc(as(uid), 'content/site'), { fields, updatedAt: serverTimestamp(), updatedBy: uid, ...extra })
  test('anyone can read it', async () => {
    await seed({ 'content/site': { fields: { 'service.time': '10 AM' } } })
    await assertSucceeds(getDoc(doc(anonymous(), 'content/site')))
  })
  test('admins can publish allowed fields', () => assertSucceeds(publish('ana', {
    'service.time': '10 AM', 'contactEmail': 'hello@example.org', 'links.giving': 'https://example.org/give',
    'home.hero.mainPhoto': '/images/home-1.webp', 'home.hero.nearPhoto': 'https://example.org/photo.webp',
  })))
  test('admins can clear every override', () => assertSucceeds(publish('ana', {})))
  test('members and visitors cannot publish', async () => {
    await assertFails(publish('ben', { 'service.time': '10 AM' }))
    await assertFails(setDoc(doc(anonymous(), 'content/site'), { fields: {} }))
  })
  test('unknown fields, long values, and unsafe addresses are rejected', async () => {
    await assertFails(publish('ana', { 'navigation': 'x' }))
    await assertFails(publish('ana', { 'home.hero.headingLine1': 'x'.repeat(33) }))
    await assertFails(publish('ana', { 'service.time': '   ' }))
    await assertFails(publish('ana', { 'service.time': 42 }))
    await assertFails(publish('ana', { 'links.giving': 'javascript:alert(1)' }))
    await assertFails(publish('ana', { 'home.hero.mainPhoto': '//evil.example/x.webp' }))
    await assertFails(publish('ana', { 'home.hero.mainPhoto': 'data:image/svg+xml,x' }))
    await assertFails(publish('ana', { 'contactEmail': 'not an email' }))
  })
  test('the publisher must be recorded truthfully', () => assertFails(publish('ana', {}, { updatedBy: 'ben' })))
})

test('everything else is closed', async () => {
  await assertFails(getDoc(doc(as('ana'), 'secrets/x')))
  await assertFails(setDoc(doc(as('ana'), 'content/other'), { a: 1 }))
})
