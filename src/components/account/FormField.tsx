import type { PropsWithChildren, ReactNode } from 'react'

export function FormField({ id, label, hint, children }: PropsWithChildren<{ id: string; label: string; hint?: ReactNode }>) {
  return <div className="form-field"><label htmlFor={id}>{label}</label>{children}{hint && <p className="form-hint" id={`${id}-hint`}>{hint}</p>}</div>
}

export function FormMessage({ error, success }: { error?: string; success?: string }) {
  if (error) return <p className="form-message form-error" role="alert">{error}</p>
  if (success) return <p className="form-message form-success" role="status">{success}</p>
  return null
}
