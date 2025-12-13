const STORAGE_KEY = 'ssms_token'

export const TokenStorage = {
  get(): string | null {
    try { return localStorage.getItem(STORAGE_KEY) } catch { return null }
  },
  set(token: string) {
    try { localStorage.setItem(STORAGE_KEY, token) } catch {}
  },
  remove() {
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }
}
