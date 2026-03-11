const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/fitness'

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
  // Убираем дублирование /api/fitness если оно уже есть в path
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const url = `${DEFAULT_BASE_URL}${cleanPath}`

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
  const data = text ? (JSON.parse(text) as unknown) : null

  if (!response.ok) {
    const message =
      (data &&
        typeof data === 'object' &&
        'message' in data &&
        typeof (data as { message?: string }).message === 'string' &&
        (data as { message: string }).message) ??
      `Ошибка ${response.status}: ${response.statusText}`

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