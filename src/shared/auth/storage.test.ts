import { readStoredAuth, writeStoredAuth } from './storage'

describe('auth storage', () => {
  const STORAGE_KEY = 'skyfitnesspro_auth'

  beforeEach(() => {
    window.localStorage.clear()
  })

  it('writes token and reads it back', () => {
    writeStoredAuth({ token: 'token-123' })

    expect(readStoredAuth()).toEqual({ token: 'token-123' })
  })

  it('returns null for empty storage', () => {
    expect(readStoredAuth()).toBeNull()
  })

  it('returns null for malformed json in storage', () => {
    window.localStorage.setItem(STORAGE_KEY, '{invalid-json}')

    expect(readStoredAuth()).toBeNull()
  })

  it('returns null for object without valid token', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: 42 }))

    expect(readStoredAuth()).toBeNull()
  })

  it('removes token when null is passed', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: 'to-remove' }))

    writeStoredAuth(null)

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(readStoredAuth()).toBeNull()
  })
})
