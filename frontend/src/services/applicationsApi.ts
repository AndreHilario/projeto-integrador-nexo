import { appConfig } from '../config/app'
import type { Application, ApplicationStatus } from '../types'

class ApiError extends Error {}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = options.method ?? 'GET'
  const url = `${appConfig.applicationsApiBaseUrl}${path}`
  console.debug(`[applicationsApi] -> ${method} ${url}`)

  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    console.error(`[applicationsApi] <- ${method} ${url} status=${response.status}`, body)
    throw new ApiError(body?.message ?? 'Não foi possível completar a requisição.')
  }

  console.debug(`[applicationsApi] <- ${method} ${url} status=${response.status}`)
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

export const applicationsApi = {
  /** Candidato: lista as próprias candidaturas. */
  listMine(token: string) {
    return request<Application[]>('/applications', { headers: authHeaders(token) })
  },

  /** Empresa: lista as candidaturas recebidas em uma vaga específica. */
  listByJob(token: string, jobId: string) {
    return request<Application[]>(`/applications?jobId=${jobId}`, { headers: authHeaders(token) })
  },

  create(token: string, jobId: string, matchScore: number) {
    return request<Application>('/applications', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ jobId, matchScore }),
    })
  },

  updateStatus(token: string, applicationId: string, status: ApplicationStatus) {
    return request<Application>(`/applications/${applicationId}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ status }),
    })
  },
}
