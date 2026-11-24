/** Runs a form action with busy and error state. */
export async function runAction(setBusy: (busy: boolean) => void, setError: (error: string) => void, action: () => Promise<void>) {
  setBusy(true)
  setError('')
  try { await action() } catch (error) { setError((error as Error).message) } finally { setBusy(false) }
}
