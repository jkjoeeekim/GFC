/** Normalizes what someone typed to E.164. Ten-digit numbers are treated as US numbers. */
export function toE164(input: string): string | null {
  const digits = input.replace(/\D/g, '')
  if (input.trim().startsWith('+')) return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}

export function formatPhone(e164: string) {
  const us = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(e164)
  return us ? `(${us[1]}) ${us[2]}-${us[3]}` : e164
}
