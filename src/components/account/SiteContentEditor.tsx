import { useMemo, useState, useSyncExternalStore } from 'react'
import { useAccount } from '../../account/useAccount'
import { applySiteContentPatch, editableFields, readSiteField } from '../../content/editableFields'
import { publishedSite, toStoredValue } from '../../content/publishedSite'
import { defaultSite } from '../../content/useContent'
import { runAction } from '../../account/runAction'
import { FormField, FormMessage } from './FormField'

const groups: [string, (path: string) => boolean][] = [
  ['Sunday service', path => path.startsWith('service.')],
  ['Contact and links', path => path === 'contactEmail' || path.startsWith('links.')],
  ['Homepage opening', path => path.startsWith('home.hero.')],
  ['House church section', path => path.startsWith('home.community.')],
  ['Closing invitation', path => path.startsWith('home.invitation.')],
]
const inputType = { text: 'text', email: 'email', url: 'url', image: 'text' } as const

/** Form over the `editableFields` contract. Only values that differ from the site's originals are published. */
export function SiteContentEditor() {
  const { publishSite } = useAccount()
  const live = useSyncExternalStore(publishedSite.subscribe, publishedSite.get)
  const current = useMemo(() => Object.fromEntries(editableFields.map(f => [f.path, readSiteField(live, f.path)])), [live])
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [published, setPublished] = useState('')
  const value = (path: string) => edits[path] ?? current[path]
  const changed = editableFields.some(f => value(f.path) !== current[f.path])

  function publish() {
    const patch: Record<string, string> = {}
    for (const { path } of editableFields) {
      const next = value(path).trim()
      if (next !== readSiteField(defaultSite, path)) patch[path] = next
    }
    applySiteContentPatch(defaultSite, patch)
    return publishSite(Object.fromEntries(Object.entries(patch).map(([path, v]) => [path, toStoredValue(path, v)])))
  }

  return <form className="content-editor" onSubmit={event => {
    event.preventDefault()
    setPublished('')
    runAction(setBusy, setError, async () => { await publish(); setEdits({}); setPublished('Published. The website now shows these details.') })
  }}>
    {groups.map(([title, inGroup]) => <fieldset key={title} className="account-panel">
      <legend>{title}</legend>
      {editableFields.filter(f => inGroup(f.path)).map(field => {
        const id = `field-${field.path.replace(/\./g, '-')}`
        const original = readSiteField(defaultSite, field.path)
        const props = { id, value: value(field.path), maxLength: field.maxLength, required: true, onChange: (e: { target: { value: string } }) => { setEdits({ ...edits, [field.path]: e.target.value }); setPublished('') } }
        return <FormField key={field.path} id={id} label={field.label} hint={value(field.path) === original ? undefined : <>Original: “{original}” <button type="button" className="text-button" onClick={() => setEdits({ ...edits, [field.path]: original })}>Use original</button></>}>
          {field.maxLength > 120 && field.type === 'text' ? <textarea {...props} rows={3} /> : <input {...props} type={inputType[field.type]} />}
        </FormField>
      })}
    </fieldset>)}
    <div className="content-editor-actions">
      <FormMessage error={error} success={published} />
      <button className="button" disabled={busy || !changed}>{busy ? 'Publishing…' : 'Publish changes'}</button>
      <button type="button" className="button button-outline" disabled={busy || !changed} onClick={() => { setEdits({}); setError('') }}>Discard changes</button>
    </div>
  </form>
}
