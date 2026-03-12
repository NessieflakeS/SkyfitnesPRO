const DEFAULT_BASE_URL = String(import.meta.env.VITE_API_BASE_URL ?? '/api/fitness')

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

type ApiError = {
  message: string
  status: number
}

async function request<TResponse>(
  path: string,
  options: {
    method?: HttpMethod
    body?: unknown
    token?: string | null
  } = {},
): Promise<TResponse> {
  const url = `${DEFAULT_BASE_URL}${path}`

  const headers = new Headers()
  headers.set('Content-Type', 'application/json')
  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  const text = await response.text()
  let data: unknown = null
  try {
    data = text ? (JSON.parse(text) as unknown) : null
  } catch {
    data = { raw: text }
  }

  if (!response.ok) {
    const method = options.method ?? 'GET'
    if (import.meta.env.DEV) {
      console.error('[API Error]', method, path, '→', response.status)
      console.error('[API Error] response body:', typeof data === 'object' && data !== null ? JSON.stringify(data, null, 2) : data)
    }

    const obj = data && typeof data === 'object' ? (data as Record<string, unknown>) : null
    const message =
      (typeof obj?.message === 'string' && obj.message) ||
      (typeof obj?.error === 'string' && obj.error) ||
      (response.status >= 500
        ? 'Ошибка сервера. Откройте консоль браузера (F12) для деталей.'
        : 'Произошла ошибка при запросе')

    const error = new Error(message) as Error & ApiError
    error.status = response.status
    throw error
  }

  return data as TResponse
}

export const apiClient = {
  get: <TResponse>(path: string, token?: string | null) =>
    request<TResponse>(path, { method: 'GET', token }),
  post: <TResponse>(path: string, body: unknown, token?: string | null) =>
    request<TResponse>(path, { method: 'POST', body, token }),
  patch: <TResponse>(path: string, body: unknown, token?: string | null) =>
    request<TResponse>(path, { method: 'PATCH', body, token }),
  delete: <TResponse>(path: string, token?: string | null) =>
    request<TResponse>(path, { method: 'DELETE', token }),
}

export type { ApiError }
