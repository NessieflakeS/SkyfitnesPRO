const STORAGE_KEY = 'skyfitnesspro_auth'

export type StoredAuth = {
  token: string
}

export function readStoredAuth(): StoredAuth | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (
      parsed &&
      typeof parsed === 'object' &&
      'token' in parsed &&
      typeof (parsed as { token?: unknown }).token === 'string'
    ) {
      return { token: (parsed as { token: string }).token }
    }
  } catch {
  }
  return null
}

export function writeStoredAuth(data: StoredAuth | null) {
  try {
    if (!data) {
      window.localStorage.removeItem(STORAGE_KEY)
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  } catch {
  }
}
