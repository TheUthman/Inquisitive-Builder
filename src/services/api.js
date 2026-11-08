const configuredBase = import.meta.env.VITE_API_BASE_URL?.trim()
const apiBase = (configuredBase || '/api/v1').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {})
  headers.set('Accept', 'application/json')

  let body = options.body
  if (body && typeof body !== 'string' && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(`${apiBase}${path}`, {
      ...options,
      body,
      headers,
      credentials: 'include',
    })
  } catch {
    throw new ApiError('The portfolio API could not be reached.', 0)
  }

  if (response.status === 204) return null

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new ApiError('The portfolio API is not connected yet.', response.status)
  }

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(payload?.message || 'The request could not be completed.', response.status)
  }

  return payload
}
